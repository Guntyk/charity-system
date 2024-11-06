const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');

const Volunteer = sequelize.define(
  'Volunteer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vol_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Project,
        key: 'id',
      },
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vol_phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'volunteers',
  }
);

module.exports = Volunteer;
