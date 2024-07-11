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

        // Conditionally update the birth_date if it is not null, empty, or whitespace
        let updateQuery;
        if (newUserDetails.birth_date && newUserDetails.birth_date.trim() !== '') {
          updateQuery = "UPDATE user_details SET full_name = ?, display_name = ?, birth_date = ?, phone_number = ? WHERE user_id = ?";
        } else {
          updateQuery = "UPDATE user_details SET full_name = ?, display_name = ?, phone_number = ? WHERE user_id = ?";
        }

        dbConn.query(
          updateQuery,
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
              console.error("Error inserting user details into the database: ", insertError);
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

UserDetails.update = (updatedUserDetails, callback) => {
  const userId = updatedUserDetails.user_id;
  if (!userId) {
    return callback(new Error("User ID is required"), null);
  }

  // Create the query dynamically based on provided fields
  const fields = [];
  const values = [];

  if (updatedUserDetails.full_name) {
    fields.push("full_name = ?");
    values.push(updatedUserDetails.full_name);
  }
  if (updatedUserDetails.display_name) {
    fields.push("display_name = ?");
    values.push(updatedUserDetails.display_name);
  }
  if (updatedUserDetails.birth_date) {
    fields.push("birth_date = ?");
    values.push(updatedUserDetails.birth_date);
  }
  if (updatedUserDetails.phone_number) {
    fields.push("phone_number = ?");
    values.push(updatedUserDetails.phone_number);
  }
  if (updatedUserDetails.is_account_banned !== undefined) {
    fields.push("isAccountBanned = ?");
    values.push(updatedUserDetails.is_account_banned);
  }

  if (fields.length === 0) {
    return callback(new Error("No fields to update"), null);
  }

  values.push(userId); // Add user ID as the last parameter for the WHERE clause

  const updateQuery = `UPDATE user_details SET ${fields.join(", ")} WHERE user_id = ?`;

  dbConn.query(updateQuery, values, (updateError, updateResult) => {
    if (updateError) {
      console.error("Error updating user details: ", updateError);
      return callback(updateError, null);
    } else {
      return callback(null, updateResult);
    }
  });
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

  UserDetails.getUserDetailsByUserId = (user_id, callback) => {
    dbConn.query(
      'SELECT u.id, u.status, u.type, u.email_add, ud.full_name, ud.display_name, ud.birth_date, ud.country, ud.phone_number, ud.modified_at, ud.created_at, ud.isAdmin, ud.isWriterVerified, ud.isEmailVerified, ud.writerApplicationStatus, ud.imageId, ud.wingsCount, ud.isSubscriber, ud.subscriptionExpirationDate, ud.isReadingModeOver18, ud.writerBadge, ud.readerBadge FROM user u LEFT JOIN user_details ud ON u.id = ud.user_id WHERE u.id = ?',
      [user_id],
      (error, result) => {
        if (error) {
          console.error('Error fetching user details: ', error);
          return callback(error, null);
        } else {
          return callback(null, result);
        }
      }
    );
  };

  UserDetails.getAuthorUserDetailsByAuthor = (author, callback) => {
    dbConn.query(
      'SELECT * FROM ravensanz_users WHERE display_name = ? OR full_name = ?',
      [author, author],
      (error, result) => {
        if (error) {
          console.error('Error fetching user details: ', error);
          return callback(error, null);
        } else {
          return callback(null, result);
        }
      }
    );
  };

  UserDetails.getStoriesByAuthor = (author, callback) => {
    dbConn.query(
      'SELECT * FROM v_story_details WHERE author = ?',
      [author],
      (error, result) => {
        if (error) {
          console.error('Error fetching stories: ', error);
          return callback(error, null);
        } else {
          return callback(null, result);
        }
      }
    );
  };
  
  

module.exports = UserDetails;
