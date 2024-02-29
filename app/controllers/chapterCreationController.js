const StoryEpisodeModel = require('../models/chapterCreationModel');

// Controller
const chapterCreationController = {};

chapterCreationController.getStoryEpisodes = (req, res) => {
    const storyId = req.query.story_id;

    if (!storyId) {
        return res.status(400).json({ message: "Missing story_id parameter" });
    }

    // Call the model to get story episodes by storyId
    StoryEpisodeModel.getStoryEpisodesByStoryId(storyId, (error, episodes) => {
        if (error) {
            console.error("Error getting story episodes by storyId: ", error);
            return res.status(500).json({ message: "Error getting story episodes" });
        }
        return res.status(200).json({ message: "Story episodes retrieved", data: episodes });
    });
};

// Controller method to create story episodes
chapterCreationController.createStoryEpisodes = (req, res) => {
    // Extract data from request body
    const { userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId } = req.body;

    // Check if any required field is missing
    if (!userId || !subTitle || !storyLine || !status || !wingsRequired || !storyId) {
        return res.status(400).json({ message: "Missing required fields in request body" });
    }

    // Call the model method to create story episodes
    StoryEpisodeModel.createStoryEpisodes(userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId, (error, result) => {
        if (error) {
            if (error.message === "User with the provided userId does not exist" || error.message === "Story with the provided storyId does not exist") {
                return res.status(404).json({ message: error.message });
            } else {
                return res.status(500).json({ message: "Internal server error" });
            }
        }
        return res.status(201).json({ message: "Story episode created successfully", episodeId: result.episodeId });
    });
};



module.exports = chapterCreationController;
