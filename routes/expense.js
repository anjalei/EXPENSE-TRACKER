const express = require('express');
const router = express.Router();
const {addUser,fetchUser} = require('../controller/expenseController');

router.get('/user',fetchUser);
router.post('/post',addUser);

module.exports = router;