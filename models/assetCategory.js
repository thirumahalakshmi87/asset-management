const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetCategory = sequelize.define('AssetCategory', {

    category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    category_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },

    category_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    description: {
        type: DataTypes.STRING(100)
    },    
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'asset_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = AssetCategory;