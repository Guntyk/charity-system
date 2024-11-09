const express = require('express');
const router = express.Router();
const { getAllProjects, createProject, deleteProjects } = require('../controllers/projectsController');
const checkAdmin = require('../middleware/checkAdmin');

router.get('/', getAllProjects);
router.post('/', checkAdmin, createProject);
router.delete('/', checkAdmin, deleteProjects);

module.exports = router;
