const Volunteer = require('../models/Volunteer');

const getAllVolunteers = async (req, res) => {
  try {
    const Volunteers = await Volunteer.findAll();
    res.status(200).json(Volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error while getting volunteers', error });
  }
};

const createVolunteer = async (req, res) => {
  const { name, email, phoneNumber, organizationID } = req.body;

  try {
    const newVolunteer = await Volunteer.create({ name, email, phoneNumber, organizationID });
    res.status(201).json(newVolunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating volunteer', error });
  }
};

const deleteVolunteers = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No volunteers selected for deletion' });
  }

  try {
    await Volunteer.destroy({
      where: { id: ids },
    });
    res.status(200).json({ message: 'Volunteers deleted successfully', deletedIds: ids });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting volunteers', error });
  }
};

module.exports = {
  getAllVolunteers,
  createVolunteer,
  deleteVolunteers,
};
