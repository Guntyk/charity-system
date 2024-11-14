const sequelize = require('../config/database');
const Organization = require('./Organization');
const Project = require('./Project');
const Transaction = require('./Transaction');
const Volunteer = require('./Volunteer');
const User = require('./User');

Organization.hasMany(Project, { foreignKey: 'organizationID' });
Project.belongsTo(Organization, { foreignKey: 'organizationID' });

Organization.hasMany(Volunteer, { foreignKey: 'organizationID' });
Volunteer.belongsTo(Organization, { foreignKey: 'organizationID' });

const ProjectVolunteer = sequelize.define('ProjectVolunteer', {}, { timestamps: false });

Project.belongsToMany(Volunteer, { through: ProjectVolunteer, foreignKey: 'projectID' });
Volunteer.belongsToMany(Project, { through: ProjectVolunteer, foreignKey: 'volunteerID' });

Project.hasMany(Transaction, { foreignKey: 'projectID' });
Transaction.belongsTo(Project, { foreignKey: 'projectID' });

Volunteer.hasMany(Transaction, { foreignKey: 'volunteerID' });
Transaction.belongsTo(Volunteer, { foreignKey: 'volunteerID' });

module.exports = {
  sequelize,
  Organization,
  Project,
  Transaction,
  Volunteer,
  User,
  ProjectVolunteer,
};
