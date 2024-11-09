const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Organization = require('./Organization');

const Volunteer = sequelize.define(
  'Volunteer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationID: {
      type: DataTypes.INTEGER,
      references: {
        model: Organization,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'volunteers',
  }
);

module.exports = Volunteer;
