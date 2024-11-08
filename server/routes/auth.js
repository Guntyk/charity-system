const express = require('express');
const { register, login, getCurrentUser, refresh } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getCurrentUser);
router.post('/refresh', refresh);

module.exports = router;
