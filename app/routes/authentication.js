
const express = require('express');
const router = express.Router();
const authentication = require('../controllers/authenticationController');

// Routes
router.post('/google', authentication.createUserByGoogle);
// router.post('/apple', authentication.createUserByApple);

module.exports = router;
