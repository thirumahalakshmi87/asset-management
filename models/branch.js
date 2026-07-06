const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('Branch', {

    branch_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    branch_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },

    branch_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    address: {
        type: DataTypes.STRING(100)
    },

    city: {
        type: DataTypes.STRING(100)
        
    },
	state: {
        type: DataTypes.STRING(100)
        
    },
country: {
        type: DataTypes.STRING(100)
        
    },
    

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'branches',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Branch;