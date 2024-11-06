const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Volunteer = require('./Volunteer');
const Project = require('./Project');

const Donation = sequelize.define(
  'Donation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vol_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Volunteer,
        key: 'id',
      },
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
    donation: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'donations',
  }
);

module.exports = Donation;
