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
