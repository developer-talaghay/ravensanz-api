// routes/googleSignupRoutes.js
const express = require('express');
const router = express.Router();
const googleSignupController = require('../controllers/googleSignupController');
const firebaseAuthMiddleware = require('../middlewares/firebaseAuthMiddleware');

// Define your user signup route with authentication
router.post('/', firebaseAuthMiddleware, googleSignupController.signupGoogle);

module.exports = router;
