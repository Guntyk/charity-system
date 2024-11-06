const express = require('express');
const { getAllOrganizations, createOrganization } = require('../controllers/organizationController');
const router = express.Router();

router.get('/', getAllOrganizations);
router.post('/', createOrganization);

module.exports = router;
