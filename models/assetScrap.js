const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetScrap = sequelize.define('AssetScrap', {

    scrap_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    asset_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    scrap_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    scrap_reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    scrap_value: {
        type: DataTypes.DECIMAL(12, 2)
    },

    remarks: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'asset_scraps',

    timestamps: true,

    createdAt: 'created_at',

    updatedAt: false
});

module.exports = AssetScrap;