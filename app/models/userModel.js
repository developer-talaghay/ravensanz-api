// models/userDetailsModel.js
const dbConn = require("../config/db.config");

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

module.exports = UserDetails;
