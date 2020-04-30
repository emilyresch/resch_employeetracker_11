const express = require('express');
const app = express();
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "company_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected!")
    firstQuestion();
    // newQuery();
});



//FIRST function, starts off the questions
function firstQuestion() {
    console.log("MAIN MENU");
    inquirer
        .prompt({
            name: "tableEdit",
            type: "list",
            message: "Welcome! Which part of the company database would you like to manage?",
            choices: ["Departments", "Roles", "Employees", "View Full Tables", "EXIT"]
        })
        .then(function (answers) {
            console.log(answers.tableEdit);
            if (answers.tableEdit === "Departments") {
                inquirer
                    .prompt({
                        name: "deptChoice",
                        type: "list",
                        message: "Welcome! How would you like to manage Departments?",
                        choices: ["ADD", "VIEW", "DELETE", "EXIT"]
                    })
                    .then(function (answer) {
                        // console.log(answer.deptChoice);
                        if (answer.deptChoice === "ADD") {
                            addDept();
                        } else if (answer.deptChoice === "DELETE") {
                            deleteDept();
                        } else if (answer.deptChoice === "VIEW") {
                            viewDept();
                        } else {
                            console.log("See you soon!");
                            connection.end();
                        }
                    });
            } else if (answers.tableEdit === "Roles") {
                inquirer
                    .prompt({
                        name: "roleChoice",
                        type: "list",
                        message: "How would you like to manange Roles?",
                        choices: ["ADD", "VIEW", "UPDATE EMPLOYEE ROLES", "DELETE", "EXIT"]
                    })
                    .then(function (answer) {
                        if (answer.roleChoice === "ADD") {
                            addRole()
                        } else if (answer.roleChoice === "UPDATE EMPLOYEE ROLES") {
                            updateEmpRoles();
                        } else if (answer.roleChoice === "DELETE") {
                            deleteRole();
                        } else if (answer.roleChoice === "VIEW") {
                            viewRole();
                        } else {
                            console.log("See you soon!");
                            connection.end();
                        }
                    });
            } else if (answers.tableEdit === "Employees") {
                inquirer
                    .prompt({
                        name: "empChoice",
                        type: "list",
                        message: "How would you like to manange Employees?",
                        choices: ["ADD", "VIEW", "DELETE", "EXIT"]
                    })
                    .then(function (answer) {
                        if (answer.empChoice === "ADD") {
                            addEmp();
                        } else if (answer.empChoice === "DELETE") {
                            deleteEmp();
                        } else if (answer.empChoice === "VIEW") {
                            viewEmp();
                        } else {
                            console.log("See you soon!");
                            connection.end();
                        }
                    });
            } else if (answers.tableEdit === "View Full Tables") {
                inquirer
                    .prompt({
                        name: "viewchoice",
                        type: "list",
                        message: "Which table would you like to view?",
                        choices: ["DEPARTMENTS AND ROLES", "ROLES AND EMPLOYEES", "EXIT"]
                    }).then(function (answer) {
                        if (answer.viewchoice === "DEPARTMENTS AND ROLES") {
                            seeDeptRoles();
                        } else if (answer.viewchoice === "ROLES AND EMPLOYEES") {
                            seeEmpRoles();
                        } else {
                            console.log("See you soon!");
                        }
                    })
            }

        })
}; //end firstQ

//Return to main menu question
function newQuery() {
    inquirer
        .prompt({
            name: "return",
            type: "confirm",
            message: "Return to main menu?",
        }).then(function (answer) {
            if (answer.return) {
                firstQuestion();
            } else {
                console.log("See you soon!");
                connection.end();
            }
        })
}

/////////////////DEPARTMENT FUNCTIONS//////////////////
function addDept() {
    //console log so user can see
    console.log("ADD A NEW DEPARTMENT");
    //start mySQL connection
    connection.query("SELECT * FROM department", function (err, data) {
        inquirer.prompt([{
                name: "deptadd",
                type: "input",
                message: "Whats the NAME of the DEPARTMENT you would like to add?",
            }])
            .then(function (answer) {
                console.log(answer.deptadd);
                connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptadd], function (err, res) {
                    if (err) throw err;
                    // console.log("Sorry, we are not able to add this department now.");
                    //function to view new department table
                    viewDept();
                })
            })
    })


}

function deleteDept() {
    console.log("DELETE DEPARTMENT");
    connection.query("SELECT * FROM department", function (err, data) {
        console.log(data);
        if (err) throw err;
        //ask for name of dept to remove
        inquirer.prompt([{
                name: "deptdel",
                type: "list",
                message: "Which DEPARTMENT would you like to remove?",
                choices: function () {
                    var deptArray = [];
                    for (var i = 0; i < data.length; i++) {
                        deptArray.push(data[i].name);
                    }
                    return deptArray;
                }
            }])
            .then(function (answer) {
                console.log(answer.deptdel);
                if (answer.deptdel) {
                    connection.query("DELETE FROM department WHERE name = ?", [answer.deptdel], function (err, data) {
                        if (err) throw err;
                        console.log("Deleting the " + answer.deptdel + " Department");
                        viewDept();
                    })
                }
            })

    })

}

function viewDept() {
    console.log("-----VIEW DEPARTMENTS-----");
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        console.table(data);
        newQuery();
    })
}

////////////////////ROLE FUNCTIONS/////////////////////
function addRole() {
    //console log so user can see
    console.log("ADD A NEW ROLE");
    //start mySQL connection
    connection.query("SELECT * FROM role", function (err, data) {
        inquirer.prompt([{
                    name: "roleadd",
                    type: "input",
                    message: "Whats the NAME of the ROLE you would like to add?",
                },
                {
                    name: "salaryadd",
                    type: "input",
                    message: "Whats the SALARY of the ROLE you would like to add?",
                },
                {
                    name: "deptId",
                    type: "number",
                    message: "What DEPARTMENT ID does this ROLE belong to (number)?",
                }

            ])
            .then(function (answer) {
                // console.log(answer);
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleadd, answer.salaryadd, answer.deptId], function (err, res) {
                    if (err) throw err;
                    //function to view new role table
                    newQuery();
                    // viewRole();
                })
            })
    })
}

function deleteRole() {
    console.log("DELETE ROLE");
    connection.query("SELECT * FROM role", function (err, data) {
        console.log(data);
        if (err) throw err;
        //ask for name of dept to remove
        inquirer.prompt([{
                name: "roledel",
                type: "list",
                message: "Which department would you like to remove?",
                choices: function () {
                    var roleArray = [];
                    for (var i = 0; i < data.length; i++) {
                        roleArray.push(data[i].title);
                    }
                    return roleArray;
                }
            }])
            .then(function (answer) {
                console.log(answer.roledel);
                if (answer.roledel) {
                    connection.query("DELETE FROM role WHERE title = ?", [answer.roledel], function (err, data) {
                        if (err) throw err;
                        console.log("Deleting the " + answer.roledel + " Role");
                        viewRole();
                    })
                }
            })

    })
    // newQuery();
};

function viewRole() {
    console.log("-----VIEW ROLES-----");
    connection.query("SELECT * FROM role", function (err, data) {
        if (err) throw err;
        console.table(data);
        newQuery();
    })
};

//////////////////EMPLOYEE FUNCTIONS///////////////////
function addEmp() {
    //console log so user can see
    console.log("ADD A NEW EMPLOYEE");
    //start mySQL connection
    connection.query("SELECT * FROM employee", function (err, data) { //this might have to be a join query to get the role_id
        inquirer.prompt([{
                    name: "firstname",
                    type: "input",
                    message: "What's the FIRST NAME of the EMPLOYEE you would like to add?",
                },
                {
                    name: "lastname",
                    type: "input",
                    message: "What's the LAST NAME of the EMPLOYEE you would like to add?",
                },
                {
                    name: "roleId",
                    type: "number",
                    message: "What is this employee's ROLE ID (number)?",

                }
            ])
            //need to combine Role data somehow
            .then(function (answer) {
                // var empAnswer = answer;
                // viewEmp();
                connection.query("INSERT INTO employee(first_name, last_name, role_id) VALUE (?, ?, ?)",
                    [answer.firstname, answer.lastname, answer.roleId],
                    function (err, data) {
                        if (err) throw err;
                        viewEmp();


                    })
            })
    })
    // newQuery();
}


function deleteEmp() {
    console.log("DELETE EMPLOYEE");
    connection.query("SELECT * FROM employee", function (err, data) {
        console.table(data);
        if (err) throw err;
        //ask for name of emp to remove
        inquirer.prompt([{
                name: "empdel",
                type: "list",
                message: "What is the last name of the EMPLOYEE you would like to delete?",
                choices: function () {
                    var empArray = [];
                    for (var i = 0; i < data.length; i++) {
                        empArray.push(data[i].last_name);
                    }
                    return empArray;
                }
            }])
            .then(function (answer) {
                console.log(answer.empdel);
                if (answer.empdel) {
                    connection.query("DELETE FROM employee WHERE last_name = ?", [answer.empdel], function (err, data) {
                        if (err) throw err;
                        console.log("Deleting Employee" + [answer.empdel]);
                        viewEmp();
                    })
                }
            })

    })
};


function viewEmp() {
    console.log("-----VIEW EMPLOYEES-----");
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        console.table(data);
        newQuery();
    })
}

function updateEmpRoles() {
    connection.query("SELECT employee.id, first_name, last_name, title, role_id FROM role LEFT JOIN employee ON employee.role_id = role.id", function (err, data) {
        if (err) throw err;
        console.table(data);
        inquirer.prompt([{
                name: "empId",
                type: "number",
                message: "What is the ID number of the EMPLOYEE whose role you would like to UPDATE?"
            },
            {
                name: "roleId",
                type: "number",
                message: "What is the updated ROLE ID number?"
            }
        ]).then(function (answer) {
            connection.query("UPDATE employee SET role_id = ? WHERE id = ?;", [answer.roleId, answer.empId], function (err, data) {
                console.log("UPDATING ROLE ID");
                viewEmp();
            })
        })

    })
}
///////////////////////COMBO TABLES//////////////////////
function seeEmpRoles() {
    console.log("VIEW ROLES and EMPLOYEES");
    connection.query("SELECT employee.id, title, salary, first_name, last_name FROM role JOIN employee ON employee.role_id = role.id", function (err, data) {
        if (err) throw err;
        cTable.table(data);
        newQuery();
    })
}

function seeDeptRoles() {
    console.log("VIEW DEPARTMENTS and ROLES");
    connection.query("SELECT name, title, salary FROM department LEFT JOIN role ON role.department_id = department.id", function (err, data) {
        if (err) throw err;
        console.table(data);
        newQuery();
    })
}

app.listen(PORT, function () {
    console.log(PORT);
});