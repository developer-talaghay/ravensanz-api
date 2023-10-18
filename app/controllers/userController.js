// controllers/userDetailsController.js
const UserDetailsModel = require("../models/userModel");

exports.createUserDetails = (req, res) => {
  const newUserDetails = {
    user_id: req.body.user_id,
    full_name: req.body.full_name,
    display_name: req.body.display_name,
    birth_date: req.body.birth_date,
    phone_number: req.body.phone_number
  };

  UserDetailsModel.create(newUserDetails, (error, result) => {
    if (error) {
      console.error("Error creating or updating user details: ", error);
      return res.status(500).send({ message: "Error creating or updating user details" });
    } else {
      console.log("User details created or updated successfully");
      res.status(201).json({
        message: "User details created or updated successfully",
        data: result,
      });
    }
  });
};

exports.checkEmail = (req, res) => {
    const { email_add } = req.body;
  
    UserDetailsModel.checkEmailExistence(email_add, (error, emailExists) => {
      if (error) {
        console.error("Error checking email existence: ", error);
        return res.status(500).send({ message: "Error checking email existence" });
      }
  
      if (emailExists) {
        // Email exists in the user table
        return res.status(200).send({ message: "User exists" });
      } else {
        // Email doesn't exist in the user table
        return res.status(404).send({ message: "User not found" });
      }
    });
  };

  exports.resetPassword = (req, res) => {
    const { email_add, password, new_password } = req.body;
  
    UserDetailsModel.resetPassword(email_add, password, new_password, (error, result) => {
      if (error) {
        console.error("Error resetting password: ", error);
        return res.status(500).send(error);
      }
  
      res.status(200).json(result);
    });
  };

  exports.getUser = (req, res) => {
    const user_id = req.query.id; // Assuming the user_id is provided in the query parameter
  
    UserDetailsModel.getUserDetailsByUserId(user_id, (error, result) => {
      if (error) {
        console.error('Error retrieving user details: ', error);
        return res.status(500).json({ message: 'Error retrieving user details' });
      } else {
        if (result.length > 0) {
          const userDetails = result[0]; // Assuming there is only one user with the given user_id
          return res.status(200).json({ message: 'User details retrieved successfully', data: userDetails });
        } else {
          return res.status(404).json({ message: 'User details not found' });
        }
      }
    });
  };
  
