const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction } = require('../controllers/transactionsController');
const checkAdmin = require('../middleware/checkAdmin');

router.get('/', getAllTransactions);
router.post('/', checkAdmin, createTransaction);

module.exports = router;
