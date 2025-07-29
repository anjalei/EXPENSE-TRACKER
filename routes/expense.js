const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const {getExpense,getExpenseById,postExpense,updateExpenseById,deleteExpenseById,downloadExpenses,getDownloadHistory} = require('../controller/expenseController');

router.get('/expense', authenticateUser, getExpense);
router.get('/expense/:id', authenticateUser, getExpenseById);
router.post('/postexpense', authenticateUser, postExpense);
router.put('/updateexpense/:id', authenticateUser, updateExpenseById);
router.delete('/deleteexpense/:id', authenticateUser, deleteExpenseById);
router.get('/download', authenticateUser, downloadExpenses);
router.get('/download/history', authenticateUser,getDownloadHistory);

module.exports = router;