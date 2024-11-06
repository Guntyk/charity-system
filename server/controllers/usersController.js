const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'name', 'role'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

module.exports = {
  getAllUsers,
};
