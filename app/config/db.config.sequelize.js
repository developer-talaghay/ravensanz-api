const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize({
  host: 'localhost',
  username: 'root',
  password: 'asdqwe123',
  database: 'ravensanz_db',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4', // Set the character set
  },
  connectTimeout: 10000, // Timeout in milliseconds
  logging: console.log, // Enable logging
});

module.exports = sequelize;

// local to server side
// const { Sequelize } = require('sequelize');
// const dotenv = require('dotenv').config();

// const sequelize = new Sequelize({
//   host: 'ec2-3-136-15-249.us-east-2.compute.amazonaws.com',
//   username: 'ravensanz_user',
//   password: 'asdqwE12#',
//   database: 'ravensanz_db',
//   dialect: 'mysql',
//   connectTimeout: 10000, // Timeout in milliseconds
//   logging: console.log, // Enable logging
// });

// module.exports = sequelize;

