const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {

    employee_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    employee_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },

    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    last_name: {
        type: DataTypes.STRING(100)
    },

    email: {
        type: DataTypes.STRING(150),
        unique: true
    },

    mobile: {
        type: DataTypes.STRING(20)
    },

    department_id: {
        type: DataTypes.UUID,
        allowNull: true
    },

    branch_id: {
        type: DataTypes.UUID,
        allowNull: true
    },

    designation: {
        type: DataTypes.STRING(100)
    },

    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    tableName: 'employees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Employee;