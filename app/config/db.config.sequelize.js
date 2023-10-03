const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize({
  host: 'localhost',
  username: 'root',
  password: '135&robert081299',
  database: 'ravensanz_db',
  dialect: 'mysql',
  connectTimeout: 10000, // Timeout in milliseconds
  logging: console.log, // Enable logging
});

module.exports = sequelize;
