const express = require('express');
const {
  getAllOrganizations,
  createOrganization,
  deleteOrganizations,
} = require('../controllers/organizationController');
const checkAdmin = require('../middleware/checkAdmin');
const router = express.Router();

router.get('/', getAllOrganizations);
router.post('/', checkAdmin, createOrganization);
router.delete('/', checkAdmin, deleteOrganizations);

module.exports = router;
