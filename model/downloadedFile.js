const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); 
const DownloadedFile = sequelize.define('DownloadedFile', {
  fileURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  downloadDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = DownloadedFile;
