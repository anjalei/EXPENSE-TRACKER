
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = ForgotPasswordRequest;
