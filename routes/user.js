const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');  
const User = require('../model/user'); 
const {addUser,loginUser,getUserStatus} = require('../controller/userController');

router.post('/post',addUser);
router.post('/login', loginUser);
router.get('/user/status', authenticateUser,getUserStatus);


module.exports = router;