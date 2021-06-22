const mysql = require('mysql2');
const inquirer = require('inquirer'); 

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,
    user:'root',

    password:'2nv2WV%eGz*AEJ#c',
    database:'employees_db'
});

connection.connect((err) => {
    if (err) throw err; 
    mainPrompt(); 
});

const mainPrompt = () => {
    inquirer.prompt({
        name: 'main',
        type: 'list',
        message: 'main menu',
        choices: [
            'Add a department',
            'Add an employee',
            'Add a role',
            'View departments',
            'View roles',
            'View employees',
            'Update employees'
        ]

    }).then((answer) => {
        switch (answer.main) {
            case 'Add a department': addDepartment();
            break;

            case 'Add an employee': addEmployee();
            break;

            case 'Add a role': addRole();
            break;

            case 'View departments': viewDepartments();
            break;

            case 'View roles': viewRoles();
            break;

            case 'View employees': viewEmployees();
            break;

            case 'Update employees': updateEmployees();
            break;
        }
    })
};


const viewDepartments = () => {
    connection.query('SELECT * FROM employees.department', (err, res) => {
        if (err) throw err;
        console.log('viewing all the departments');
        console.table(res);
        mainPrompt();
    });
};

const viewEmployees = () => {
    connection.query('SELECT * FROM employees.employee', (err, res) => {
        if (err) throw err;
        console.log('viewing all the employees');
        console.table(res);
        mainPrompt();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM employees.role', (err, res) => {
        if (err) throw err;
        console.log('viewing all roles');
        console.table(res);
        mainPrompt();
    });
};

const addRole = () => {
    connection.query('SELECT * FROM employees.department', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'enter title for new role'
            }, 
            {
                name: 'salary',
                type: 'input',
                message: 'enter salary for new role'
            },
            {
                name: 'department',
                type: 'rawlist',
                choices(){
                    const depChoice = [];
                    res.forEach(({name})=> {
                        depChoice.push(name);
                    });
                    return depChoice;
                },
                message:'choose a department',
            }
        ]).then((answer) => {
            let depResult; 
            res.forEach((role)=> {
                if(role.name === answer.department){
                    depResult = role;
                }
            })
    
            connection.query('INSERT INTO employees.role SET ?',
            {
                title: answer.title, 
                salary: answer.salary,
                department_id: depResult.id
            },
            (err) => {
                if (err) throw err; 
                console.log('role succesfully added');
                mainPrompt();
            });
        })
    })
}

const addEmployee = () => {
    connection.query('SELECT * FROM employees.employee, employees.role', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name:'first_name',
                type: 'input',
                message: 'enter new employee first name',
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'enter new employees last name',
            },
            {
                name: 'role',
                type: 'rawlist',
                choices(){
                    const roleChoice = [];
                    res.forEach(({title}) => {
                        roleChoice.push(title);
                    });
                    let resetRole = [...new Set(roleChoice)];
                    return resetRole; 
                },
                message: 'choose a role'
            },
        ]).then((answer) => {
            let roleResult; 
            res.forEach((role) => {
                if (role.title === answer.role){
                    roleResult = role;
                }
            })

            connection.query('INSERT INTO employees.employee SET ?',
            {
                first_name: answer.first_name, 
                last_name: answer.last_name,
                role_id: roleResult.id,
            },
            (err) => {
                if (err) throw err;
                console.log('employee added');
                mainPrompt();
            });

        })
    });
}

const addDepartment = () => {
    connection.query('SELECT * FROM employees.department', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'department',
                type: 'input',
                message: 'enter new department',
            }
        ]).then((answer)=>{

            connection.query('INSERT INTO employees.department SET ?',
            {
                name: answer.department
            },
            (err) => {
                if (err) throw err;
                console.log('department added'); 
                mainPrompt(); 
            });
        })
    });
}

const updateEmployees = () => {
    connection.query('SELECT * FROM employees.employee, employees.role', (err, res)=>{
        if (err) throw err;
        inquirer.prompt([
            {
                name:'employee',
                type: 'rawlist',
                choices(){
                    const empChoice = [];
                    res.forEach(({last_name}) => {
                        empChoice.push(last_name);
                    });
                    let resetEmp = [...new Set(empChoice)];
                    return resetEmp;
                },
                message: 'choose an employee to update'
            },
            {
                name: 'role',
                type: 'rawlist',
                choices(){
                    const roleSelect = []; 
                    res.forEach(({title}) => {
                        roleSelect.push(title);
                    });
                    let newRole = [...new Set(roleSelect)];
                    return newRole;
                },
                message: 'select a role to update'
            }
        ]).then((answer)=>{
            console.log(answer)
            let selectEmp;
            let selectRole;
            res.forEach((employee) => {
                if (employee.last_name === answer.employee){
                    selectEmp = employee;
                }
            })
            res.forEach((role) => {
                if(role.title === answer.role){
                    selectRole = role;
                }
            })

            connection.query('UPDATE employees.employee SET ? WHERE ?',
            [
                {
                    role_id: selectRole,
                },
                {
                    last_name: selectEmp,
                }
            ],
            (err) => {
                if (err) throw err;
                console.log('employee updated');
                mainPrompt();
            });
        })
    });
}