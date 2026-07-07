const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Asset = require('../models/asset');

const AssetTransaction = sequelize.define('AssetTransaction', {

    transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    asset_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    employee_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    expected_return_date: {
        type: DataTypes.DATEONLY
    },

    return_date: {
        type: DataTypes.DATEONLY
    },

    reason_id: {
        type: DataTypes.UUID
    },

    transaction_status: {
        type: DataTypes.STRING(20),
        defaultValue: 'ISSUED'
    },

    remarks: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'asset_transactions',

    timestamps: true,

    createdAt: 'created_at',

    updatedAt: false
});

AssetTransaction.belongsTo(Asset, {
    foreignKey: 'asset_id',
    as: 'asset'
});

module.exports = AssetTransaction;