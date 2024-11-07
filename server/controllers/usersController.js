const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'name', 'role'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

const updateUserRoles = async (req, res) => {
  try {
    const updatedUsers = [];
    const currentUserId = req.user.id;

    for (const [userId, role] of Object.entries(req.body)) {
      if (parseInt(userId, 10) === currentUserId) {
        return res.status(403).json({ message: 'You cannot change your own role' });
      }

      const roleValue = role === 1 || role === 2 ? role : null;
      if (roleValue !== null) {
        await User.update({ role: roleValue }, { where: { id: userId } });

        const updatedUser = await User.findOne({
          where: { id: userId },
          attributes: ['id', 'email', 'name', 'role'],
        });

        if (updatedUser) {
          updatedUsers.push(updatedUser);
        }
      } else {
        return res.status(400).json({ message: `Invalid role for user ID ${userId}` });
      }
    }

    res.status(200).json({ message: 'User roles updated successfully', data: updatedUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user roles', error });
  }
};

module.exports = {
  getAllUsers,
  updateUserRoles,
};
