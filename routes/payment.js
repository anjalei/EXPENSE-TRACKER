const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const {createCheckoutSession}=require("../controller/paymentController")

router.post('/create-checkout-session',authenticateUser,createCheckoutSession);


module.exports = router;