const express = require("express");
const router = express.Router();
const userResetPasswordController = require("../controllers/userResetPasswordController");

router.get("/resetpassword/:token", userResetPasswordController.verifyJWT);
router.post("/resetpassword/:token", userResetPasswordController.resetPassword);
router.post("/forgotpassword/", userResetPasswordController.forgotPassword);

module.exports = router;
