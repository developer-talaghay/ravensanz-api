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

UserModel.getUserDetails = (userId, callback) => {
  dbConn.query(
    "SELECT * FROM user_details WHERE user_id = ?",
    [userId],
    (error, result) => {
      if (error) {
        console.error("Error retrieving user details: ", error);
        return callback(error, null);
      }

      return callback(null, result);
    }
  );
};

module.exports = UserModel;
