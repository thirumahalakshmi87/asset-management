const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReturnReason = sequelize.define('ReturnReason', {

    reason_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    reason_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }

}, {
    tableName: 'return_reasons',

    timestamps: false
});

module.exports = ReturnReason;