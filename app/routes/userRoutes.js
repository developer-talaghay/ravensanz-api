const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');

// Routes
router.post("/", userControllers.createUserDetails);

module.exports = router;