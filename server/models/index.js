const sequelize = require('../config/database');
const Organization = require('./Organization');
const Project = require('./Project');
const Donation = require('./Donation');
const Volunteer = require('./Volunteer');
const Admin = require('./Admin');
const User = require('./User');

Organization.hasMany(Project, { foreignKey: 'organizationID' });
Project.belongsTo(Organization, { foreignKey: 'organizationID' });

Organization.hasMany(Volunteer, { foreignKey: 'organizationID' });
Volunteer.belongsTo(Organization, { foreignKey: 'organizationID' });

const ProjectVolunteer = sequelize.define('ProjectVolunteer', {}, { timestamps: false });

Project.belongsToMany(Volunteer, { through: ProjectVolunteer, foreignKey: 'projectID' });
Volunteer.belongsToMany(Project, { through: ProjectVolunteer, foreignKey: 'volunteerID' });

Project.hasMany(Donation, { foreignKey: 'projectID' });
Donation.belongsTo(Project, { foreignKey: 'projectID' });

Volunteer.hasMany(Donation, { foreignKey: 'volunteerID' });
Donation.belongsTo(Volunteer, { foreignKey: 'volunteerID' });

module.exports = {
  sequelize,
  Organization,
  Project,
  Donation,
  Volunteer,
  Admin,
  User,
  ProjectVolunteer,
};
