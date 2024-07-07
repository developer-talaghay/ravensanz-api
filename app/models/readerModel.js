const dbConn = require('../config/db.config');
const bcrypt = require("bcrypt");

const ReaderModel = {};

// GET all readers with optional search, order, and pagination
ReaderModel.getAllReaders = (searchQuery, order = 'ASC', limit = 10, offset = 0, callback) => {
  let sql = `SELECT u.id, d.full_name, u.email_add, d.wingsCount AS wings, d.subscriptionExpirationDate 
             FROM user u
             JOIN user_details d ON u.id = d.user_id 
             WHERE 1=1`;

  if (searchQuery) {
    sql += ` AND d.full_name LIKE ?`;
  }

  sql += ` ORDER BY u.id ${order} LIMIT ? OFFSET ?`;

  const queryParams = [];
  if (searchQuery) {
    queryParams.push(`%${searchQuery}%`);
  }
  queryParams.push(parseInt(limit, 10), parseInt(offset, 10));

  dbConn.query(sql, queryParams, (error, results) => {
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
  const { email_add, password, full_name, wingsCount, subscriptionExpirationDate } = updateData;

  const updateReaderData = (hashedPassword) => {
    const userUpdateData = {
      email_add,
      ...(hashedPassword && { password: hashedPassword }),
    };

    const userSql = `UPDATE user SET ? WHERE id = ?`;
    dbConn.query(userSql, [userUpdateData, id], (error, result) => {
      if (error) {
        console.error('Error updating reader: ', error);
        return callback(error, null);
      }

      const detailsUpdateData = {
        full_name,
        wingsCount,
        subscriptionExpirationDate,
      };

      const detailsSql = `UPDATE user_details SET ? WHERE user_id = ?`;
      dbConn.query(detailsSql, [detailsUpdateData, id], (error, result) => {
        if (error) {
          console.error('Error updating reader details: ', error);
          return callback(error, null);
        }
        callback(null, result);
      });
    });
  };

  if (password) {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password: ", err);
        return callback(err, null);
      }
      updateReaderData(hashedPassword);
    });
  } else {
    updateReaderData(null);
  }
};

// POST reader
ReaderModel.createReader = (newReader, callback) => {
  const { email_add, password, full_name, wingsCount, subscriptionExpirationDate } = newReader;
  const saltRounds = 10;

  // Hash the password before inserting
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password: ", err);
      return callback(err, null);
    } else {
      // Insert into user table
      const userSql = `INSERT INTO user (email_add, password, created_at, modified_at) VALUES (?, ?, NOW(), NOW())`;
      dbConn.query(userSql, [email_add, hashedPassword], (error, result) => {
        if (error) {
          console.error('Error creating reader: ', error);
          return callback(error, null);
        }
        const userId = result.insertId;

        // Insert into user_details table
        const detailsSql = `INSERT INTO user_details (user_id, full_name, wingsCount, subscriptionExpirationDate, created_at, modified_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
        dbConn.query(detailsSql, [userId, full_name, wingsCount, subscriptionExpirationDate], (error, detailsResult) => {
          if (error) {
            console.error('Error creating reader details: ', error);
            return callback(error, null);
          }
          callback(null, { userId, userDetailsId: detailsResult.insertId });
        });
      });
    }
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