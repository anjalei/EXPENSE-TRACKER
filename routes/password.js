const express = require('express');
const router = express.Router();
const passwordController = require('../controller/PasswordController');


router.post('/forgotpassword', passwordController.forgotPassword);


router.get('/resetpassword/:id', passwordController.resetPasswordForm);


router.post('/resetpassword/:id', passwordController.resetPassword);

module.exports = router;
