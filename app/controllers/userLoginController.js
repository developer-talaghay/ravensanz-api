const UserModel = require('../models/userLoginModel');
const bcrypt = require('bcrypt');

const userLoginController = {};

userLoginController.checkEmail = (req, res) => {
  const { email_add, password } = req.body;

  UserModel.getByEmail(email_add, (error, user) => {
    if (error) {
      console.error("Error checking email: ", error);
      return res.status(500).send("Error checking email");
    }

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords: ", err);
        return res.status(500).send("Error comparing passwords");
      }

      if (!isMatch) {
        return res.status(401).send("Invalid password");
      }

      // Password is correct, retrieve user details
      UserModel.getUserDetails(user.id, (error, userDetails) => {
        if (error) {
          console.error("Error retrieving user details: ", error);
          return res.status(500).send("Error retrieving user details");
        }

        // Return user details
        res.status(200).json({
          message: "Login successful",
          userDetails,
        });
      });
    });
  });
};

module.exports = userLoginController;
