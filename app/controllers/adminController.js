// adminController.js
const AdminModel = require("../models/adminModel");

const adminController = {};

adminController.createStory = (req, res) => {
  // Extract story details from request body
  const newStoryDetails = {
    userId: req.body.userId,
    title: req.body.title,
    blurb: req.body.blurb,
    language: req.body.language,
    genre: req.body.genre,
    status: req.body.status
  };

  // Validate required fields
  if (!newStoryDetails.userId || !newStoryDetails.title || !newStoryDetails.blurb || !newStoryDetails.language || !newStoryDetails.genre || !newStoryDetails.status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  AdminModel.createStory(newStoryDetails, (error, result) => {
    if (error) {
      console.error("Error creating story: ", error);
      return res.status(500).json({ message: "Error creating story" });
    }
    console.log("Story created successfully");
    res.status(201).json({
      message: "Story created successfully",
      data: result
    });
  });
};

module.exports = adminController;
