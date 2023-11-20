const dbConn = require("../config/db.config");

const UserModel = {};

UserModel.getDeviceTokens = (callback) => {
  dbConn.query("SELECT device_token FROM user", (error, result) => {
    if (error) {
      console.error("Error retrieving device tokens: ", error);
      return callback(error, null);
    }

    const deviceTokens = result.map(row => row.device_token).filter(Boolean);
    return callback(null, deviceTokens);
  });
};

module.exports = UserModel;
