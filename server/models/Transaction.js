const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Volunteer = require('./Volunteer');
const Project = require('./Project');

const Transaction = sequelize.define(
  'Transaction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    volunteerID: {
      type: DataTypes.INTEGER,
      references: {
        model: Volunteer,
        key: 'id',
      },
      allowNull: false,
    },
    projectID: {
      type: DataTypes.INTEGER,
      references: {
        model: Project,
        key: 'id',
      },
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.ENUM('deposit', 'withdrawal'),
      allowNull: false,
      comment: 'Type of transaction: deposit or withdrawal',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Transaction sum',
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Transaction purpose',
    },
  },
  {
    tableName: 'transactions',
    timestamps: true,
  }
);

module.exports = Transaction;
