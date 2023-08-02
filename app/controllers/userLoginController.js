const UserModel = require('../models/userLoginModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userLoginController = {};

userLoginController.checkEmail = (req, res) => {
  const { email_add, password } = req.body;

  UserModel.getByEmail(email_add, async (error, user) => {
    if (error) {
      console.error("Error checking email: ", error);
      return res.status(500).send({ message: "Error checking email" });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Compare password
    bcrypt.compare(password, user.password, async (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords: ", err);
        return res.status(500).send({ message: "Error comparing passwords" });
      }

      if (!isMatch) {
        return res.status(401).send({ message: "Check email/password" });
      }

      // Password is correct, retrieve user details
      UserModel.getUserDetailsByUserId(user.id, (error, userDetails) => {
        if (error) {
          console.error("Error retrieving user details: ", error);
          return res.status(500).send({ message: "Error retrieving user details" });
        }

        // Generate a new token (JWT)
        const token = jwt.sign({ email: email_add }, "your-secret-key", {
          expiresIn: "7d", // Token expires in 7 days
        });

        // Update the token in the user table
        UserModel.updateUserToken(user.id, token, (updateError) => {
          if (updateError) {
            console.error("Error updating user token: ", updateError);
            return res.status(500).send({ message: "Error updating user token" });
          }

          // Remove sensitive data from the user object
          const { password, token, ...userData } = user;

          // Return user details and token in the response
          res.status(200).json({
            message: "Login successful",
            token: token,
            userDetails: userData, // Use the filtered userData object
          });
        });
      });
    });
  });
};

module.exports = userLoginController;
