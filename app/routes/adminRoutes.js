const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes
router.post("/story", adminController.createStory);


module.exports = router;