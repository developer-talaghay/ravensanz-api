// models/userDetailsModel.js
const dbConn = require("../config/db.config");
const User = require("./userSignupModel");
const bcrypt = require("bcrypt");

const UserDetails = {};

UserDetails.create = (newUserDetails, callback) => {
  // Check if user_id already exists
  dbConn.query(
    "SELECT * FROM user_details WHERE user_id = ?",
    [newUserDetails.user_id],
    (selectError, selectResult) => {
      if (selectError) {
        console.error("Error checking user details existence: ", selectError);
        return callback(selectError, null);
      } else if (selectResult.length > 0) {
        // Update the existing record
        dbConn.query(
          "UPDATE user_details SET full_name = ?, display_name = ?, birth_date = ?, phone_number = ? WHERE user_id = ?",
          [
            newUserDetails.full_name,
            newUserDetails.display_name,
            newUserDetails.birth_date,
            newUserDetails.phone_number,
            newUserDetails.user_id
          ],
          (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating user details: ", updateError);
              return callback(updateError, null);
            } else {
              return callback(null, updateResult);
            }
          }
        );
      } else {
        // Insert a new record
        dbConn.query(
          "INSERT INTO user_details (user_id, full_name, display_name, birth_date, phone_number) VALUES (?, ?, ?, ?, ?)",
          [
            newUserDetails.user_id,
            newUserDetails.full_name,
            newUserDetails.display_name,
            newUserDetails.birth_date,
            newUserDetails.phone_number
          ],
          (insertError, insertResult) => {
            if (insertError) {
              console.error("Error inserting user details into database: ", insertError);
              return callback(insertError, null);
            } else {
              return callback(null, insertResult);
            }
          }
        );
      }
    }
  );
};

UserDetails.checkEmailExistence = (email, callback) => {
    dbConn.query(
      "SELECT * FROM user WHERE email_add = ?",
      [email],
      (error, result) => {
        if (error) {
          console.error("Error checking email existence: ", error);
          return callback(error, null);
        }
  
        if (result.length > 0) {
          return callback(null, true); // Email exists
        } else {
          return callback(null, false); // Email doesn't exist
        }
      }
    );
  };

  UserDetails.resetPassword = (email, password, newPassword, callback) => {
    // Check if the email and current password match
    dbConn.query(
      "SELECT * FROM user WHERE email_add = ?",
      [email],
      async (error, result) => {
        if (error) {
          console.error("Error retrieving user by email: ", error);
          return callback(error, null);
        }
  
        if (result.length === 0) {
          return callback({ message: "User not found" }, null);
        }
  
        const user = result[0];
  
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return callback({ message: "Invalid password" }, null);
        }
  
        // Hash the new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
  
        // Update the password in the user table
        dbConn.query(
          "UPDATE user SET password = ? WHERE email_add = ?",
          [newPasswordHash, email],
          (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating user password: ", updateError);
              return callback(updateError, null);
            }
  
            return callback(null, { message: "Password updated successfully" });
          }
        );
      }
    );
  };

module.exports = UserDetails;
