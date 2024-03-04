const StoryEpisodeModel = require('../models/chapterCreationModel');
const formidable = require('formidable');

// Controller
const chapterCreationController = {};

chapterCreationController.getStoryEpisodes = (req, res) => {
    const storyId = req.query.storyId;

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

chapterCreationController.getChapterById = (req, res) => {
    const chapterId = req.params.chapterId; // Change req.query to req.params

    if (!chapterId) {
        return res.status(400).json({ message: "Missing chapterId parameter" });
    }

    // Call the model to get story episode by chapterId
    StoryEpisodeModel.getStoryEpisodeByEpisodeId(chapterId, (error, episode) => { // Change to getStoryEpisodeByEpisodeId
        if (error) {
            console.error("Error getting story episode by chapterId: ", error);
            return res.status(500).json({ message: "Error getting story episode" });
        }
        return res.status(200).json({ message: "Story episode retrieved", data: episode }); // Change episodes to episode
    });
};




// Controller method to create story episodes
chapterCreationController.createStoryEpisodes = (req, res) => {
    // Create a new instance of Formidable
    const form = new formidable.IncomingForm();

    // Parse the incoming request containing form data
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({ message: "Error parsing form data" });
        }

        // Extract data from parsed fields
        const { userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId, totalWords } = fields;

        // Check if any required field is missing
        if (!userId || !subTitle || !storyLine || !status || !wingsRequired || !storyId || !totalWords) {
            return res.status(400).json({ message: "Missing required fields in request body" });
        }

        // Call the model method to create story episodes
        StoryEpisodeModel.createStoryEpisodes(userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId, totalWords, (error, result) => {
            if (error) {
                if (error.message === "User with the provided userId does not exist" || error.message === "Story with the provided storyId does not exist") {
                    return res.status(404).json({ message: error.message });
                } else {
                    return res.status(500).json({ message: "Internal server error" });
                }
            }
            return res.status(201).json({ message: "Story episode created successfully", episodeId: result.episodeId });
        });
    });
};


// Controller method to update story episodes
chapterCreationController.updateStoryEpisodes = (req, res) => {
    // Create a new instance of Formidable
    const form = new formidable.IncomingForm();

    // Parse the incoming request containing form data
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({ message: "Error parsing form data" });
        }
        
        // Extract data from parsed fields
        const {subTitle, storyLine, totalWords, isVIP, writerNote, status, publishedDate, wingsRequired } = fields;

        // Ensure single values instead of arrays
        const idValue = req.query.id;
        const storyIdValue = req.query.storyId;
        const subTitleValue = subTitle[0];
        const storyLineValue = storyLine[0];
        const totalWordsValue = totalWords[0];
        const isVIPValue = isVIP[0];
        const writerNoteValue = writerNote[0];
        const statusValue = status[0];
        const publishedDateValue = publishedDate[0];
        const wingsRequiredValue = wingsRequired[0];

        // Call the model method to update story episodes
        StoryEpisodeModel.updateStoryEpisodes(idValue, storyIdValue, subTitleValue, storyLineValue, totalWordsValue, isVIPValue, writerNoteValue, statusValue, publishedDateValue, wingsRequiredValue, (error, result) => {
            if (error) {
                if (error.message === "Episode with the provided ID and storyID does not exist") {
                    return res.status(404).json({ message: error.message });
                } else {
                    return res.status(500).json({ message: "Internal server error" });
                }
            }
            return res.status(200).json({ message: "Story episode updated successfully" });
        });
    });
};

chapterCreationController.deleteStoryEpisodes = (req, res) => {
    const episodeId = req.query.id; // Assuming the id is provided as a query parameter

    if (!episodeId) {
        return res.status(400).json({ message: "Missing id parameter" });
    }

    // Call the model to delete the story episode by id
    StoryEpisodeModel.deleteStoryEpisodeById(episodeId, (error, success) => {
        if (error) {
            console.error("Error deleting story episode: ", error);
            return res.status(500).json({ message: "Error deleting story episode" });
        }
        if (!success) {
            return res.status(404).json({ message: "No episode found with the provided id" });
        }
        return res.status(200).json({ message: "Story episode deleted successfully" });
    });
};



module.exports = chapterCreationController;
