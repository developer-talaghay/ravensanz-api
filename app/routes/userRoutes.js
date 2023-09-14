const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');

// Routes
router.post("/", userControllers.createUserDetails);

// forgotpassword/reset
router.post("/forgotpassword", userControllers.checkEmail);
router.post("/resetpassword", userControllers.resetPassword);



module.exports = router;