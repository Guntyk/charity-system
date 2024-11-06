const Organization = require('../models/Organization');

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении организаций', error });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (organization) {
      res.status(200).json(organization);
    } else {
      res.status(404).json({ message: 'Организация не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении организации', error });
  }
};

exports.createOrganization = async (req, res) => {
  const { name, contactPerson, phoneNumber } = req.body;
  try {
    const newOrganization = await Organization.create({ name, contactPerson, phoneNumber });
    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании организации', error });
  }
};

exports.updateOrganization = async (req, res) => {
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
      res.status(404).json({ message: 'Организация не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении организации', error });
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (organization) {
      await organization.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Организация не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении организации', error });
  }
};
