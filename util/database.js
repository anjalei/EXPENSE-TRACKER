const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('expense','root','Anjali@2001',{
    dialect : 'mysql',
    host : 'localhost'
});

module.exports= sequelize;