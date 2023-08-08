// models/StoryModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config.sequelize'); // Assuming you have a database configuration

const StoryModel = sequelize.define('story_list', {

  id: {
    type: DataTypes.STRING,
    allowNull: false, // Assuming you want the ID to be required
    unique: true, // Make the ID column unique
    primaryKey: true, // Make the ID column part of the primary key
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageId: DataTypes.STRING,
  title: DataTypes.STRING,
  language: DataTypes.STRING,
  blurb: DataTypes.STRING,
  times: DataTypes.STRING,
  totalBookmarks: DataTypes.INTEGER,
  totalViews: DataTypes.INTEGER,
  totalPublishedChapters: DataTypes.INTEGER,
  totalVIP: DataTypes.INTEGER,
  totalLikers: DataTypes.INTEGER,
  totalWords: DataTypes.INTEGER,
  totalEpisodes: DataTypes.INTEGER,
  contentRating: DataTypes.STRING,
  isCompleted: DataTypes.BOOLEAN,
  isSigned: DataTypes.BOOLEAN,
  isVIP: DataTypes.BOOLEAN,
  vipStatus: DataTypes.STRING,
  completionStatus: DataTypes.STRING,
  contractStatus: DataTypes.STRING,
  contractImageId: DataTypes.STRING,
  genre: DataTypes.STRING,
  status: DataTypes.STRING,
  wingsRequired: DataTypes.INTEGER,
  amountRequired: DataTypes.FLOAT,
  adminNotes: DataTypes.TEXT,
  isPublished: DataTypes.BOOLEAN,
  averageRatings: DataTypes.FLOAT,
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = StoryModel;
