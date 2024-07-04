const dbConn = require('../config/db.config');
const bcrypt = require("bcrypt");

const WriterModel = {};

// GET all writers
WriterModel.getAllWriters = (callback) => {
  const sql = `SELECT id, full_name, email_add, wingsCount AS wings, subscriptionExpirationDate 
               FROM ravensanz_users 
               WHERE isWriterVerified = 1`;
  dbConn.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching writers: ', error);
      return callback(error, null);
    }
    callback(null, results);
  });
};

// GET writer by ID
WriterModel.getWriterById = (id, callback) => {
  const sql = `SELECT id, full_name, email_add, wingsCount AS wings, subscriptionExpirationDate 
               FROM ravensanz_users 
               WHERE id = ? AND isWriterVerified = 1`;
  dbConn.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error fetching writer by ID: ', error);
      return callback(error, null);
    }
    callback(null, result[0]);
  });
};

// PATCH writer
WriterModel.updateWriter = (id, updateData, callback) => {
  const sql = `UPDATE ravensanz_users SET ? WHERE id = ? AND isWriterVerified = 1`;
  dbConn.query(sql, [updateData, id], (error, result) => {
    if (error) {
      console.error('Error updating writer: ', error);
      return callback(error, null);
    }
    callback(null, result);
  });
};

// POST writer
WriterModel.createWriter = (newWriter, callback) => {
  const { email_add, password, ...otherData } = newWriter;
  const saltRounds = 10;

  // Hash the password before inserting
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password: ", err);
      return callback(err, null);
    } else {
      const writerData = {
        email_add,
        password: hashedPassword,
        ...otherData
      };
      const sql = `INSERT INTO ravensanz_users SET ?`;
      dbConn.query(sql, writerData, (error, result) => {
        if (error) {
          console.error('Error creating writer: ', error);
          return callback(error, null);
        }
        callback(null, result);
      });
    }
  });
};

// DELETE writer
WriterModel.deleteWriter = (id, callback) => {
  const sql = `DELETE FROM ravensanz_users WHERE id = ? AND isWriterVerified = 1`;
  dbConn.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error deleting writer: ', error);
      return callback(error, null);
    }
    callback(null, result);
  });
};

module.exports = WriterModel;