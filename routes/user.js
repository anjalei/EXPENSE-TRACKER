const express = require('express');
const router = express.Router();
const {addUser,loginUser} = require('../controller/userController');


router.post('/post',addUser);
router.post('/login', loginUser);



module.exports = router;