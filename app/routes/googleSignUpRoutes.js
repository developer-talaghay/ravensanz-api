// app/routes/googleSignupRoutes.js
const express = require('express');
const router = express.Router();
const googleSignupController = require('../controllers/googleSignupController');

// Routes
router.get('/', googleSignupController.redirectToGoogleAuth);
router.get('/callback', googleSignupController.handleGoogleAuthCallback);

module.exports = router;
