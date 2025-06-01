
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');  
const { createOrder, confirmPayment } = require('../controller/paymentController');

router.post('/pay', authenticateUser, createOrder);
router.get('/confirm', confirmPayment);

module.exports = router;
