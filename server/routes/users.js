const express = require('express');
const { getAllUsers, updateUserRoles } = require('../controllers/usersController');
const checkAdmin = require('../middleware/checkAdmin');
const router = express.Router();

router.get('/', getAllUsers);
router.put('/roles', checkAdmin, updateUserRoles);

module.exports = router;
