const {Department, Role, Employee} = require('./models');
const inquirer = require('inquirer');
const sequelize = require('./config/connection');
const { update } = require('./models/Role');


const updateEmployee = async () => {
    let deptData = await Employee.findAll({include:[{model: Role}]});
    let empListData = deptData.map(employee => `${employee.id} - ${employee.name}`);
    let userInput = await inquirer.prompt([
        {
            type: 'list',
            message: 'Choose an employee',
            name: 'emp',
            choices: empListData
        },
        {
            type: 'input',
            message: 'What is their new title? ',
            name: 'title',
        },
        {
            type: 'input',
            message: 'What is their new salary? ',
            name: 'salary',
        }
    ]);

    let updatedRole = {
        title: userInput.title,
        salary: userInput.salary
    }

    Role.update(updatedRole, {where: {id: userInput.emp.split(' ')[0]}});

    menu();


}


const view = async () => {
    console.log('employees viewed here');

    let deptData = await Employee.findAll({include:[{model: Role}]});
    let depts = await Department.findAll();

    console.log('\n### Employees ###')
    deptData.forEach(employee => {
        console.log(`Name: ${employee.name} || Department: ${depts[employee.dept_id - 1].name} || Title: ${employee.role.title} || Salary: ${employee.role.salary}`)
    });
    menu();
};

const add_dept = async () => {
    
    let userInput = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the Department? ',
            name: 'deptName',
        }
    ]);

    console.log(userInput.deptName);
    await Department.create({name: userInput.deptName});
    console.log('New department created');
    menu();
};


const add_employee = async () => {
    let deptData = await Department.findAll();
    let deptSelect = [];
    deptSelect.push("Create new department");

    deptData.forEach(dept => {
        deptSelect.push(`${dept.id} - ${dept.name}`);
    });

    let userInput = await inquirer.prompt([
        {
            type: 'list',
            message: 'Select a department or create a new one',
            name: 'option',
            choices: deptSelect
        }
    ]);

    if(userInput.option == "Create new department"){
        let userInput = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the Department? ',
                name: 'deptName',
            }
        ]);
        let newDept = await Department.create({name: userInput.deptName});
        console.log('New department created');
        empDept = newDept.id;
    } else {
        empDept = userInput.option.split(' ')[0];
    }

    let empInput = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the Employee? ',
            name: 'name',
        },
        {
            type: 'input',
            message: 'What is their title? ',
            name: 'title',
        },
        {
            type: 'input',
            message: 'What is their salary ',
            name: 'salary',
        },
    ]);

    let empInfo = {
        name: empInput.name,
        dept_id: empDept,
    }

    let newEmp = await Employee.create(empInfo);

    let roleInfo = {
        title: empInput.title,
        salary: empInput.salary,
        employee_id: newEmp.id, 
    }

    let newRole = await Role.create(roleInfo);

    menu();
};


const menu = async () => {
    let userInput = await inquirer.prompt([
        {
            type: 'list',
            message: 'Choose an option',
            name: 'option',
            choices: [
                'View employees',
                'Add employee',
                'Add department',
                'Update Employee Role',
                'Exit',
            ]
        }
    ]);

    if (userInput.option == 'Exit'){
        console.log('goodbye')
        process.exit();
    } else if (userInput.option == 'Add department'){
        add_dept();
    } else if (userInput.option == 'Add role'){
        add_role();
    } else if (userInput.option == 'Add employee'){
        add_employee();
    } else if (userInput.option == 'View employees'){
        view();
    } else if (userInput.option == 'Update Employee Role') {
        updateEmployee();
    }
};


sequelize.sync({ force: false }).then(() => {
    menu();
});

