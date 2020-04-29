-- insert values into department table
INSERT INTO department (name)
VALUES("Customer Service"), 
("HQ");

-- insert values into role table
INSERT INTO role (title, salary, department_id)
VALUES("GES", 15, 1),
("Game Guide", 13, 1),
("Manager", 20, 2);
("GQM", 19, 2);

-- insert values into employee table
INSERT INTO employee (first_name, last_name, role_id)
VALUES("Emily", "Resch", 1),
("Tyler", "Summers", 3),
("Lindsay", "Marsland", 1),
("Cason", "Jolly", 2),
("Jon", "Clothier", 3);

-- SOME QUERIES --

-- select everything from each table
SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

-- Left join department and role tables w name, title and salay
SELECT name, title, salary
FROM department
LEFT JOIN role
ON department.id = role.department_id;

-- Left join role and employee tables with title, salary, fn and ln
SELECT title, salary, first_name, last_name
FROM role
LEFT JOIN employee
ON role.id = employee.role_id;


-- delete employee from employee table
DELETE FROM employee WHERE id=5; 

SELECT * FROM department;

DELETE FROM department WHERE name;

SELECT * FROM role;

SELECT * FROM employee;

SELECT *
FROM department
LEFT JOIN role
ON department.id = role.department_id;

SELECT title, salary, first_name, last_name
FROM role
LEFT JOIN employee
ON role.id = employee.role_id;

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Jon", "Clothier", 3);