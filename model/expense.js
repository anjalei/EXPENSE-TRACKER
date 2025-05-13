const{DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Expense = sequelize.define('expense',{
    id:{
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
        unique : true
    },
    expenseamount:{
        type : DataTypes.STRING,
        allowNull : false,
    },
    description:{
        type : DataTypes.STRING,
        allowNull : false,
    },
    category:{
        type : DataTypes.STRING,
        allowNull : false,
    }
});
module.exports = Expense;