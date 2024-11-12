const Transaction = require('../models/Transaction');

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error while getting transactions', error });
  }
};

const createTransaction = async (req, res) => {
  const { volunteerID, projectID, type, amount, purpose } = req.body;

  try {
    const newTransaction = await Transaction.create({ volunteerID, projectID, transactionType: type, amount, purpose });
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
};
