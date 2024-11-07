const express = require('express');
const { getAllUsers, updateUserRoles } = require('../controllers/usersController');
const router = express.Router();

router.get('/', getAllUsers);
router.put('/roles', updateUserRoles);

module.exports = router;
