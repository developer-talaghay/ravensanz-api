// "use strict";
// const mysql = require("mysql2");
// const dotenv = require("dotenv").config();
// //local mysql db connection
// const dbConn = mysql.createConnection({
//   host: 'ec2-18-117-252-199.us-east-2.compute.amazonaws.com',
//   user: 'ravensanz_user',
//   password: 'asdqwE12#',
//   database: 'ravensanz_db',
//   connectTimeout: 10000 // Timeout in milliseconds
// });

// dbConn.connect(function (err) {
//   if (err) throw err;
//   console.log("Database Connected!");
// });

// module.exports = dbConn;

// server side
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

// local side
// "use strict";
// const mysql = require("mysql2");
// const dotenv = require("dotenv").config();
// //local mysql db connection
// const dbConn = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '135&robert081299',
//   database: 'ravensanz_db',
//   connectTimeout: 10000 // Timeout in milliseconds
// });

// dbConn.connect(function (err) {
//   if (err) throw err;
//   console.log("Database Connected!");
// });

// module.exports = dbConn;
