"use strict";
const mysql = require("mysql");
const dotenv = require("dotenv").config();
//local mysql db connection
const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'asdqwe123',
  database: 'ravensanz_db',
  connectTimeout: 10000 // Timeout in milliseconds
});

dbConn.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});

module.exports = dbConn;

