const{DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
        unique : true
    },
    username:{
        type : DataTypes.STRING,
        allowNull : false,
    },
    password:{
        type : DataTypes.STRING,
        allowNull : false,
    }
});
module.exports = User;