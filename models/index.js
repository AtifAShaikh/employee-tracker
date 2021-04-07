const Department = require('./Department');
const Role = require('./Role');
const Employee = require('./Employee');



Employee.hasOne(Role, {
    foreignKey: 'employee_id',
});

Role.belongsTo(Employee, {
    foreignKey: 'emplyee_id',
})

Department.hasMany(Employee, {
    foreignKey: 'dept_id',
})

Employee.belongsTo(Department,{
    foreignKey: 'dept_id',
});





module.exports = {Department, Role, Employee};