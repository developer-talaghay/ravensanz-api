const UserModel = require('../models/userLoginModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userLoginController = {};

userLoginController.checkEmail = (req, res) => {
  const { email_add, password, device_token } = req.body;

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

        // Set default values for fields if they are null
        const defaultValues = {
          full_name: "No name",
          display_name: "No name",
          birth_date: "1970-01-01",
          country: "N/A",
          phone_number: "##########",
          isAdmin: "0",
          isWriterVerified: "0",
          isEmailVerified: "0",
          writerApplicationStatus: "0",
          imageId: "0",
          wingsCount: 100,
          isSubscriber: "0",
          subscriptionExpirationDate: "1970-01-01",
          isReadingModeOver18: "0",
          writerBadge: "0",
          readerBadge: "0",
        };

        // Combine user details with user object
        const userWithDetails = { ...user, ...userDetails[0] };

        // Apply default values to the user object
        const userWithDefaults = {
          id: userWithDetails.user_id,
          status: userWithDetails.status,
          type: userWithDetails.type,
          email_add: userWithDetails.email_add,
          full_name: userWithDetails.full_name || defaultValues.full_name,
          display_name: userWithDetails.display_name || defaultValues.display_name,
          birth_date: userWithDetails.birth_date || defaultValues.birth_date,
          country: userWithDetails.country || defaultValues.country,
          phone_number: userWithDetails.phone_number || defaultValues.phone_number,
          modified_at: userWithDetails.modified_at,
          created_at: userWithDetails.created_at,
          isAdmin: userWithDetails.isAdmin || defaultValues.isAdmin,
          isWriterVerified: userWithDetails.isWriterVerified || defaultValues.isWriterVerified,
          isEmailVerified: userWithDetails.isEmailVerified || defaultValues.isEmailVerified,
          writerApplicationStatus: userWithDetails.writerApplicationStatus || defaultValues.writerApplicationStatus,
          imageId: userWithDetails.imageId || defaultValues.imageId,
          wingsCount: userWithDetails.wingsCount || defaultValues.wingsCount,
          isSubscriber: userWithDetails.isSubscriber || defaultValues.isSubscriber,
          subscriptionExpirationDate: userWithDetails.subscriptionExpirationDate || defaultValues.subscriptionExpirationDate,
          isReadingModeOver18: userWithDetails.isReadingModeOver18 || defaultValues.isReadingModeOver18,
          writerBadge: userWithDetails.writerBadge || defaultValues.writerBadge,
          readerBadge: userWithDetails.readerBadge || defaultValues.readerBadge,
        };

        // Update device_token in the database
        if (device_token) {
          UserModel.updateUserToken(email_add, device_token, (error) => {
            if (error) {
              console.error("Error updating device token: ", error);
              // Handle the error response if needed
            } else {
              console.log("Device token updated successfully");
            }
          });
        }

        // Remove unwanted part
        const { password, token, ...userData } = userWithDefaults;

        // Return user details and token in the response
        res.status(200).json({
          message: "User details retrieved successfully",
          data: userData,
        });
      });
    });
  });
};

module.exports = userLoginController;
