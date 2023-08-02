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
        return callback(null, result); // Fix: Return the query result
      } else {
        return callback(null, null);
      }
    }
  );
};

UserModel.updateUserToken = (userId, token, callback) => {
  dbConn.query(
    "UPDATE user SET token = ? WHERE id = ?",
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

module.exports = UserModel;
