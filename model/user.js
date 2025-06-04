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
    email:{
        type : DataTypes.STRING,
        allowNull : false,
    },
    password:{
        type : DataTypes.STRING,
        allowNull : false,
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    totalExpense: {
     type: DataTypes.DECIMAL(10, 2),
     defaultValue: 0,
     allowNull: false,
}
});
module.exports = User;