const dbConn = require("../config/db.config");

const UserModel = {};

UserModel.getByEmail = (email, callback) => {
  dbConn.query(
    "SELECT * FROM user WHERE email_add = ?",
    [email],
    (error, result) => {
      if (error) {
        console.error("Error retrieving user by email: ", error);
        return callback(error, null);
      }

      if (result.length > 0) {
        return callback(null, result[0]);
      } else {
        return callback(null, null);
      }
    }
  );
};

UserModel.getUserDetailsByUserId = (userId, callback) => {
  dbConn.query(
    "SELECT * FROM user_details WHERE user_id = ?",
    [userId],
    (error, result) => {
      if (error) {
        console.error("Error retrieving user details: ", error);
        return callback(error, null); // Fix: Added the callback with the error
      }

      if (result.length > 0) {
        const userDetails = result[0];

        // Check the subscriptionExpirationDate and update isSubscriber accordingly
        const now = new Date();
        const subscriptionExpirationDate = new Date(userDetails.subscriptionExpirationDate);

        let isSubscriber = "0";
        if (subscriptionExpirationDate > now) {
          isSubscriber = "1";
        }

        // Update the isSubscriber field in the database
        dbConn.query(
          "UPDATE user_details SET isSubscriber = ? WHERE user_id = ?",
          [isSubscriber, userId],
          (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating isSubscriber: ", updateError);
              return callback(updateError, null);
            }

            // Return the updated user details
            userDetails.isSubscriber = isSubscriber;
            return callback(null, [userDetails]);
          }
        );
      } else {
        return callback(null, null);
      }
    }
  );
};

UserModel.updateUserToken = (userId, token, callback) => {
  dbConn.query(
    "UPDATE user SET device_token = ? WHERE email_add = ?",
    [token, userId],
    (error, result) => {
      if (error) {
        console.error("Error updating user token: ", error);
        return callback(error);
      }

      return callback(null);
    }
  );
};

UserModel.updateDeviceToken = (userId, deviceToken, callback) => {
  dbConn.query(
    "UPDATE user SET device_token = ? WHERE id = ?",
    [deviceToken, userId],
    (error, result) => {
      if (error) {
        console.error("Error updating user device token: ", error);
        return callback(error);
      }

      return callback(null);
    }
  );
};

module.exports = UserModel;
