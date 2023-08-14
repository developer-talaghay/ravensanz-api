const express = require('express');
const router = express.Router();
const userSignupController = require('../controllers/userSignupController');

// Routes
router.post("/", userSignupController.createUser);
router.post("/userdetails", userSignupController.createUser);


module.exports = router;