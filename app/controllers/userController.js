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

// Define a function to format user details with default values
function formatUserDetails(userDetails) {
  if (!userDetails) {
    return null;
  }

  const currentDate = new Date();
  const defaultExpirationDate = new Date(currentDate.setDate(currentDate.getDate() + 3)).toISOString().split('T')[0];

  return {
    id: userDetails.id || null,
    status: userDetails.status || "false",
    type: userDetails.type || "app",
    email_add: userDetails.email_add || "No email",
    full_name: userDetails.full_name || "No name",
    display_name: userDetails.display_name || "No name",
    birth_date: userDetails.birth_date ? formatBirthDate(userDetails.birth_date) : "1970-01-01",
    country: userDetails.country || "NA",
    phone_number: userDetails.phone_number || "#########",
    modified_at: userDetails.modified_at || "1970-01-01",
    created_at: userDetails.created_at || "1970-01-01",
    isAdmin: userDetails.isAdmin || 0,
    isWriterVerified: userDetails.isWriterVerified || 0,
    isEmailVerified: userDetails.isEmailVerified || 0,
    writerApplicationStatus: userDetails.writerApplicationStatus || 0,
    imageId: userDetails.imageId || 0,
    wingsCount: userDetails.wingsCount || 0,
    isSubscriber: userDetails.isSubscriber || 1,
    subscriptionExpirationDate: userDetails.subscriptionExpirationDate || defaultExpirationDate,
    isReadingModeOver18: userDetails.isReadingModeOver18 || 0,
    writerBadge: userDetails.writerBadge || 0,
    readerBadge: userDetails.readerBadge || 0,
  };
}


exports.getUser = (req, res) => {
  const user_id = req.query.id; // Assuming the user_id is provided in the query parameter

  UserDetailsModel.getUserDetailsByUserId(user_id, (error, result) => {
    if (error) {
      console.error('Error retrieving user details: ', error);
      return res.status(500).json({ message: 'Error retrieving user details' });
    } else {
      if (result.length > 0) {
        // Assuming there is only one user with the given user_id
        const userDetails = result[0];

        // Format user details with default values for null fields
        const formattedUserDetails = formatUserDetails(userDetails);

        return res.status(200).json({
          message: 'User details retrieved successfully',
          data: formattedUserDetails,
        });
      } else {
        return res.status(404).json({ message: 'User details not found' });
      }
    }
  });
};
  
  // Helper function to format the birth_date
  function formatBirthDate(birthDate) {
    const date = new Date(birthDate);
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  

  exports.getAuthorUser = (req, res) => {
    const author = req.query.author; // Assuming the author's username or name is provided in the query parameter
  
    UserDetailsModel.getAuthorUserDetailsByAuthor(author, (error, authorDetails) => {
      if (error) {
        console.error('Error retrieving user details: ', error);
        return res.status(500).json({ message: 'Error retrieving user details' });
      }
  
      if (authorDetails.length === 0) {
        return res.status(404).json({ message: 'User details not found' });
      }
  
      UserDetailsModel.getStoriesByAuthor(author, (error, stories) => {
        if (error) {
          console.error('Error retrieving stories: ', error);
          return res.status(500).json({ message: 'Error retrieving stories' });
        }
  
        const response = {
          message: 'User details retrieved successfully',
          authorDetails: authorDetails[0], // Assuming there is only one user with the provided username or name
          stories: stories,
        };
  
        return res.status(200).json(response);
      });
    });
  };
  
