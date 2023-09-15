// models/PictureUploadModel.js
const dbConn = require("../config/db.config");

const PictureUploadModel = {};

PictureUploadModel.uploadPicture = (user_id, picture_directory, callback) => {
  // Use INSERT ... ON DUPLICATE KEY UPDATE to insert or update based on user_id
  dbConn.query(
    "INSERT INTO picture_table (user_id, picture_directory) VALUES (?, ?) ON DUPLICATE KEY UPDATE picture_directory = VALUES(picture_directory)",
    [user_id, picture_directory],
    (error, result) => {
      if (error) {
        console.error("Error updating picture_directory: ", error);
        return callback(error, null);
      }

      return callback(null, { message: "Picture uploaded successfully" });
    }
  );
};

module.exports = PictureUploadModel;
