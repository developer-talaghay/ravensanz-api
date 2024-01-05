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

const ImageModel = sequelize.define('story_images', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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

const TagModel = sequelize.define('story_tags', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true
  },
  storyId: {
    type: DataTypes.STRING,
    allowNull: true,

  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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

const EpisodeModel = sequelize.define('story_episodes', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  storyId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  number: DataTypes.INTEGER,
  subTitle: DataTypes.STRING,
  storyLine: {
    type: DataTypes.TEXT, // Use TEXT type to handle more characters
    allowNull: true, // Allow null if needed
  },
  totalWords: DataTypes.INTEGER,
  isVIP: DataTypes.BOOLEAN,
  writerNote: DataTypes.TEXT,
  status: DataTypes.STRING,
  publishedDate: DataTypes.DATE,
  wingsRequired: DataTypes.INTEGER,
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

const UserModel = sequelize.define('ravensanz_users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  firebaseId: DataTypes.STRING,
  name: DataTypes.STRING,
  contact: DataTypes.STRING,
  email: DataTypes.STRING,
  username: DataTypes.STRING,
  isAdmin: DataTypes.STRING,
  isWriterVerified: DataTypes.STRING,
  isEmailVerified: DataTypes.STRING,
  writerApplicationStatus: DataTypes.STRING,
  imageId: DataTypes.STRING,
  status: DataTypes.STRING,
  wingsCount: DataTypes.INTEGER,
  isSubscriber: DataTypes.STRING,
  subscriptionExpirationDate: DataTypes.DATE,
  isReadingModeOver18: DataTypes.STRING,
  writerBadge: DataTypes.STRING,
  readerBadge: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});


module.exports = {
  StoryModel,
  ImageModel,
  TagModel,
  EpisodeModel,
  UserModel
};
