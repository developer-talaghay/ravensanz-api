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


const Picture = function (picture) {
  this.user_id = picture.user_id;
  this.picture_directory = picture.picture_directory;
};

PictureUploadModel.findOne = (user_id, result) => {
  dbConn.query("SELECT * FROM picture_table WHERE user_id = ?", [user_id], (err, res) => {
    if (err) {
      console.error(err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log(`Found picture for user_id: ${user_id}`);
      const picture = new Picture({
        user_id: res[0].user_id,
        picture_directory: res[0].picture_directory,
      });
      result(null, picture);
      return;
    }

    console.error(`Picture not found for user_id: ${user_id}`);
    // Picture not found
    result({ kind: "not_found" }, null);
  });
};

module.exports = Picture;


module.exports = PictureUploadModel;
