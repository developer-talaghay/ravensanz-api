// adminModel.js
const dbConn = require("../config/db.config");
const { v4: uuidv4 } = require('uuid');

const AdminModel = {};

AdminModel.createStory = (storyDetails, callback) => {
  const id = uuidv4();
  const sql = `INSERT INTO story_lists (id, userId, title, blurb, language, genre, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

  // Insert the generated UUID along with other story details into the database
  dbConn.query(sql, [id, storyDetails.userId, storyDetails.title, storyDetails.blurb, storyDetails.language, storyDetails.genre, storyDetails.status], (error, result) => {
    if (error) {
      console.error("Error creating story: ", error);
      return callback(error, null);
    }
    return callback(null, result);
  });
};

module.exports = AdminModel;
