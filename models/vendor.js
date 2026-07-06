const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vendor = sequelize.define('Vendor', {

    vendor_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    vendor_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    },

    contact_person: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    mobile: {
        type: DataTypes.STRING(100)
    },

    email: {
        type: DataTypes.STRING(100)
        
    },
	address: {
        type: DataTypes.STRING(100)
        
    }
}, {
    tableName: 'vendors',
    timestamps: true,
    createdAt: 'created_at',   
	 updatedAt: false
});

module.exports = Vendor;