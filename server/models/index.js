const sequelize = require('../config/database');
const Organization = require('./Organization');
const Project = require('./Project');
const Donation = require('./Donation');
const Volunteer = require('./Volunteer');
const Admin = require('./Admin');
const User = require('./User');

Organization.hasMany(Project, { foreignKey: 'organization_id' });
Project.belongsTo(Organization, { foreignKey: 'organization_id' });

Project.hasMany(Volunteer, { foreignKey: 'project_id' });
Volunteer.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasMany(Donation, { foreignKey: 'project_id' });
Donation.belongsTo(Project, { foreignKey: 'project_id' });

Volunteer.hasMany(Donation, { foreignKey: 'vol_id' });
Donation.belongsTo(Volunteer, { foreignKey: 'vol_id' });

module.exports = {
  sequelize,
  Organization,
  Project,
  Donation,
  Volunteer,
  Admin,
  User,
};
