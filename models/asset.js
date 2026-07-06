const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const AssetCategory = require('./assetCategory');
const Vendor = require('./vendor');
const Branch = require('./branch');


const Asset = sequelize.define('Asset', {

    asset_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    asset_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },

    serial_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    asset_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    category_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    vendor_id: {
        type: DataTypes.UUID,
        allowNull: true
    },

    branch_id: {
        type: DataTypes.UUID,
        allowNull: true
    },

    make: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    model: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    purchase_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    purchase_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },

    warranty_expiry: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    asset_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'AVAILABLE'
    },

    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    tableName: 'assets',

    timestamps: true,

    createdAt: 'created_at',

    updatedAt: 'updated_at'
});


Asset.belongsTo(AssetCategory, {
    foreignKey: 'category_id',
    as: 'category'
});

Asset.belongsTo(Vendor, {
    foreignKey: 'vendor_id',
    as: 'vendor'
});

Asset.belongsTo(Branch, {
    foreignKey: 'branch_id',
    as: 'branch'
});

module.exports = Asset;