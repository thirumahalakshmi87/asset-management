const {DataTypes}=require('sequelize');

const sequelize=require('../config/database');

const Administrator=sequelize.define('Administrator',{

admin_id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true
},

username:{
type:DataTypes.STRING,
allowNull:false,
unique:true
},

password:{
type:DataTypes.STRING,
allowNull:false
},

full_name:{
type:DataTypes.STRING
},

email:{
type:DataTypes.STRING
},

is_active:{
type:DataTypes.BOOLEAN,
defaultValue:true
}

},
{

tableName:'administrators',

timestamps:true,

createdAt:'created_at',

updatedAt:'updated_at'

});

module.exports=Administrator;