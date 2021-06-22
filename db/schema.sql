DROP DATABASE IF EXISTS employees_db; 
CREATE DATABASE employees_db;

CREATE TABLE department (

id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(45) NOT NULL,
PRIMARY KEY (id)

);

CREATE TABLE role (

  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(45) NULL,
  salary DECIMAL (10,2) NULL,
  department_id INT NULL

);

CREATE TABLE employees (

  id NOT NULL AUTO_INCRIMENT PRIMARY KEY, 
  first_name VARCHAR(45) NULL,
  last_name VARCHAR(45) NULL,
  role_id INT,
  manager_id INT
)