const dbConn = require('../config/db.config');

const ReaderModel = {};

// GET all readers
ReaderModel.getAllReaders = (callback) => {
  const sql = `SELECT u.id, d.full_name, u.email_add, d.wingsCount AS wings, d.subscriptionExpirationDate 
               FROM user u
               JOIN user_details d ON u.id = d.user_id LIMIT 100`;
  dbConn.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching readers: ', error);
      return callback(error, null);
    }
    callback(null, results);
  });
};

// GET reader by ID
ReaderModel.getReaderById = (id, callback) => {
  const sql = `SELECT u.id, d.full_name, u.email_add, d.wingsCount AS wings, d.subscriptionExpirationDate 
               FROM user u
               JOIN user_details d ON u.id = d.user_id
               WHERE u.id = ?`;
  dbConn.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error fetching reader by ID: ', error);
      return callback(error, null);
    }
    callback(null, result[0]);
  });
};

// PATCH reader
ReaderModel.updateReader = (id, updateData, callback) => {
  const { email_add, full_name, wingsCount, subscriptionExpirationDate } = updateData;

  // Update user table
  const userSql = `UPDATE user SET email_add = ? WHERE id = ?`;
  dbConn.query(userSql, [email_add, id], (error, result) => {
    if (error) {
      console.error('Error updating reader email: ', error);
      return callback(error, null);
    }

    // Update user_details table
    const detailsSql = `UPDATE user_details SET full_name = ?, wingsCount = ?, subscriptionExpirationDate = ? WHERE user_id = ?`;
    dbConn.query(detailsSql, [full_name, wingsCount, subscriptionExpirationDate, id], (error, result) => {
      if (error) {
        console.error('Error updating reader details: ', error);
        return callback(error, null);
      }
      callback(null, result);
    });
  });
};

// POST reader
ReaderModel.createReader = (newReader, callback) => {
  const { email_add, password, full_name, wingsCount, subscriptionExpirationDate } = newReader;

  // Insert into user table
  const userSql = `INSERT INTO user (email_add, password, created_at, modified_at) VALUES (?, ?, NOW(), NOW())`;
  dbConn.query(userSql, [email_add, password], (error, result) => {
    if (error) {
      console.error('Error creating reader: ', error);
      return callback(error, null);
    }
    const userId = result.insertId;

    // Insert into user_details table
    const detailsSql = `INSERT INTO user_details (user_id, full_name, wingsCount, subscriptionExpirationDate, created_at, modified_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
    dbConn.query(detailsSql, [userId, full_name, wingsCount, subscriptionExpirationDate], (error, result) => {
      if (error) {
        console.error('Error creating reader details: ', error);
        return callback(error, null);
      }
      callback(null, result);
    });
  });
};

// DELETE reader
ReaderModel.deleteReader = (id, callback) => {
  // Delete from user_details table first
  const detailsSql = `DELETE FROM user_details WHERE user_id = ?`;
  dbConn.query(detailsSql, [id], (error, result) => {
    if (error) {
      console.error('Error deleting reader details: ', error);
      return callback(error, null);
    }

    // Delete from user table
    const userSql = `DELETE FROM user WHERE id = ?`;
    dbConn.query(userSql, [id], (error, result) => {
      if (error) {
        console.error('Error deleting reader: ', error);
        return callback(error, null);
      }
      callback(null, result);
    });
  });
};

module.exports = ReaderModel;