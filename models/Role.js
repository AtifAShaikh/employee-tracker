const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Role extends Model{};

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        employee_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'role',
                key: 'id',
            }
        },
        // department_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'department',
        //         key: 'id',
        //     }
        // }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'role',
    }
);

module.exports = Role;