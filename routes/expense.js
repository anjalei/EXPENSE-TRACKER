const express = require('express');
const router = express.Router();
const {getExpense,getExpenseById,postExpense,updateExpenseById,deleteExpenseById} = require('../controller/expenseController');

router.get('/expense',getExpense);
router.get('/expense/:id',getExpenseById);
router.post('/postexpense',postExpense);
router.put('/updateexpense/:id',updateExpenseById)
router.delete('/deleteexpense/:id',deleteExpenseById);

module.exports = router;