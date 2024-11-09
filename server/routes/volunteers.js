const express = require('express');
const router = express.Router();
const { getAllVolunteers, createVolunteer, deleteVolunteers } = require('../controllers/volunteersController');
const checkAdmin = require('../middleware/checkAdmin');

router.get('/', getAllVolunteers);
router.post('/', checkAdmin, createVolunteer);
router.delete('/', checkAdmin, deleteVolunteers);

module.exports = router;
