const express = require("express");
const router = express.Router();
const UserModel = require("../models/userSignupModel");
const jwt = require("jsonwebtoken");

router.get("/verify/:token", (req, res) => {
  const token = req.params.token;

  // Verify the token
  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      console.error("Error verifying token: ", err);
      return res.status(400).send("Invalid token");
    }

    // Token is valid, update user status to "verified"
    const email = decoded.email;
    UserModel.updateUserStatus(email, "verified", (updateError) => {
      if (updateError) {
        console.error("Error updating user status: ", updateError);
        return res.status(500).send("Error updating user status");
      }

      // Token verification successful
      return res.send("Email address successfully verified");
    });
  });
});

module.exports = router;