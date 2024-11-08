const Organization = require('../models/Organization');

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error while getting organizations', error });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (organization) {
      res.status(200).json(organization);
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error while getting organization', error });
  }
};

const createOrganization = async (req, res) => {
  const { name, manager, phoneNumber } = req.body;
  try {
    const newOrganization = await Organization.create({ name, contact_person: manager, phone_number: phoneNumber });
    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(500).json({ message: 'Error creating organization', error });
  }
};

const updateOrganization = async (req, res) => {
  const { name, contactPerson, phoneNumber } = req.body;
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (organization) {
      organization.name = name || organization.name;
      organization.contactPerson = contactPerson || organization.contactPerson;
      organization.phoneNumber = phoneNumber || organization.phoneNumber;
      await organization.save();
      res.status(200).json(organization);
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization', error });
  }
};

const deleteOrganizations = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No organizations selected for deletion' });
  }

  try {
    await Organization.destroy({
      where: { id: ids },
    });
    res.status(200).json({ message: 'Organizations deleted successfully', deletedIds: ids });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organizations', error });
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganizations,
};
