const dbConn = require("../config/db.config");

const AuthorWingsPurchasesModel = {};

// Get all rows from author_wings_purchases or filter by authorId
AuthorWingsPurchasesModel.getAll = (authorId, callback) => {
  let sql = "SELECT * FROM author_wings_purchases";
  const params = [];

  if (authorId) {
    sql += " WHERE authorId = ?";
    params.push(authorId);
  }

  dbConn.query(sql, params, (error, results) => {
    if (error) {
      console.error("Error fetching author_wings_purchases: ", error);
      return callback(error, null);
    }
    callback(null, results);
  });
};

// Update status of a specific row in author_wings_purchases
AuthorWingsPurchasesModel.updateStatus = (id, status, callback) => {
  const sql = "UPDATE author_wings_purchases SET status = ? WHERE id = ?";
  dbConn.query(sql, [status, id], (error, result) => {
    if (error) {
      console.error("Error updating status in author_wings_purchases: ", error);
      return callback(error, null);
    }
    callback(null, result);
  });
};

// Delete a specific row from author_wings_purchases
AuthorWingsPurchasesModel.delete = (id, callback) => {
  const sql = "DELETE FROM author_wings_purchases WHERE id = ?";
  dbConn.query(sql, [id], (error, result) => {
    if (error) {
      console.error("Error deleting row from author_wings_purchases: ", error);
      return callback(error, null);
    }
    callback(null, result);
  });
};

module.exports = AuthorWingsPurchasesModel;