const express = require('express');
const router = express.Router();
const {handleWebhook} = require('../controller/webhook');


router.post('/',handleWebhook);

module.exports = router;
