const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expense', 'admin', 'anjalirnair', {
    dialect: 'mysql',
    host: 'database-1.cfqeuy06a1yc.ap-south-1.rds.amazonaws.com'
});

module.exports = sequelize;
