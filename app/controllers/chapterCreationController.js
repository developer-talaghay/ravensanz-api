const StoryEpisodeModel = require('../models/chapterCreationModel');
const formidable = require('formidable');

// Controller
const chapterCreationController = {};

chapterCreationController.getStoryEpisodes = (req, res) => {
    const storyId = req.query.storyId;
    const episodeStatus = req.query.status;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    if (!storyId && !episodeStatus) {
        return res.status(400).json({ message: "Missing story_id or status parameter" });
    }

    if (storyId) {
        // Call the model to get story episodes by storyId
        StoryEpisodeModel.getStoryEpisodesByStoryId(storyId, limit, (error, episodes) => {
            if (error) {
                console.error("Error getting story episodes by storyId: ", error);
                return res.status(500).json({ message: "Error getting story episodes" });
            }
            return res.status(200).json({ message: "Story episodes retrieved", data: episodes });
        });
    } else {
        // Call the model to get story episodes by status
        StoryEpisodeModel.getStoryEpisodesByStatus(episodeStatus, limit, (error, episodes) => {
            if (error) {
                console.error("Error getting story episodes by status: ", error);
                return res.status(500).json({ message: "Error getting story episodes" });
            }
            return res.status(200).json({ message: "Story episodes retrieved", data: episodes });
        });
    }
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




// // Controller method to create story episodes
// chapterCreationController.createStoryEpisodes = (req, res) => {
//     // Create a new instance of Formidable
//     const form = new formidable.IncomingForm();

//     // Parse the incoming request containing form data
//     form.parse(req, (err, fields) => {
//         if (err) {
//             return res.status(400).json({ message: "Error parsing form data" });
//         }

//         // Extract data from parsed fields
//         const { userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId, totalWords } = fields;

//         // Check if any required field is missing
//         if (!userId || !subTitle || !storyLine || !status || !wingsRequired || !storyId || !totalWords) {
//             return res.status(400).json({ message: "Missing required fields in request body" });
//         }

//         // Call the model method to create story episodes
//         StoryEpisodeModel.createStoryEpisodes(userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId, totalWords, (error, result) => {
//             if (error) {
//                 if (error.message === "User with the provided userId does not exist" || error.message === "Story with the provided storyId does not exist") {
//                     return res.status(404).json({ message: error.message });
//                 } else {
//                     return res.status(500).json({ message: "Internal server error" });
//                 }
//             }
//             return res.status(201).json({ message: "Story episode created successfully", episodeId: result.episodeId });
//         });
//     });
// };


chapterCreationController.createStoryEpisodes = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({ message: "Error parsing form data" });
        }

        const { userId, subTitle, storyLine, isVIP, writerNote, status, wingsRequired, storyId, totalWords } = fields;

        if (!userId || !subTitle || !storyLine || !status || !wingsRequired || !storyId || !totalWords) {
            return res.status(400).json({ message: "Missing required fields in request body" });
        }

        StoryEpisodeModel.createStoryEpisodes(userId, subTitle, decodeURIComponent(storyLine), isVIP, writerNote, status, wingsRequired, storyId, totalWords, (error, result) => {
            if (error) {
                if (error.message === "User with the provided userId does not exist" || error.message === "Story with the provided storyId does not exist") {
                    return res.status(404).json({ message: error.message });
                } else {
                    return res.status(500).json({ message: "Internal server error" });
                }
            } else {
                StoryEpisodeModel.updateTotalPublishedChapters(storyId, (updateError, updateResult) => {
                    if (updateError) {
                        console.error("Error updating totalPublishedChapters: ", updateError);
                        return res.status(500).json({ message: "Error updating totalPublishedChapters" });
                    } else {
                        return res.status(201).json({ message: "Story episode created successfully", episodeId: result.episodeId });
                    }
                });
            }
        });
    });
};



chapterCreationController.updateStoryEpisodes = (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({ message: "Error parsing form data" });
        }
        
        const { subTitle, storyLine, totalWords, isVIP, writerNote, status, publishedDate, wingsRequired } = fields;

        const idValue = req.query.id;
        const storyIdValue = req.query.storyId;
        const subTitleValue = subTitle;
        const storyLineValue = decodeURIComponent(storyLine);
        const totalWordsValue = totalWords;
        const isVIPValue = isVIP;
        const writerNoteValue = writerNote;
        const statusValue = status;
        const publishedDateValue = publishedDate;
        const wingsRequiredValue = wingsRequired;

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

// chapterCreationController.deleteStoryEpisodes = (req, res) => {
//     const episodeId = req.query.id; // Assuming the id is provided as a query parameter

//     if (!episodeId) {
//         return res.status(400).json({ message: "Missing id parameter" });
//     }

//     // Call the model to delete the story episode by id
//     StoryEpisodeModel.deleteStoryEpisodeById(episodeId, (error, success) => {
//         if (error) {
//             console.error("Error deleting story episode: ", error);
//             return res.status(500).json({ message: "Error deleting story episode" });
//         }
//         if (!success) {
//             return res.status(404).json({ message: "No episode found with the provided id" });
//         }
//         return res.status(200).json({ message: "Story episode deleted successfully" });
//     });
// };


chapterCreationController.deleteStoryEpisodes = (req, res) => {
    const episodeId = req.query.id;

    if (!episodeId) {
        return res.status(400).json({ message: "Missing id parameter" });
    }

    StoryEpisodeModel.deleteStoryEpisodeById(episodeId, (error, deletedStoryId) => {
        if (error) {
            console.error("Error deleting story episode: ", error);
            return res.status(500).json({ message: "Error deleting story episode" });
        }
        if (!deletedStoryId) {
            return res.status(404).json({ message: "No episode found with the provided id" });
        }

        // Call updateTotalPublishedChapters after successful deletion
        StoryEpisodeModel.updateTotalPublishedChapters(deletedStoryId, (updateError, updateResult) => {
            if (updateError) {
                console.error("Error updating totalPublishedChapters: ", updateError);
                return res.status(500).json({ message: "Error updating totalPublishedChapters" });
            }
            return res.status(200).json({ message: "Story episode deleted successfully" });
        });
    });
};




chapterCreationController.getPublishedEpisodeCount = (req, res) => {
    const storyId = req.query.storyId;

    if (!storyId) {
        return res.status(400).json({ message: "Missing story_id parameter" });
    }

    // Call the model to get the count of published episodes by storyId
    StoryEpisodeModel.getPublishedEpisodeCount(storyId, (error, count) => {
        if (error) {
            console.error("Error getting published episode count: ", error);
            return res.status(500).json({ message: "Error getting published episode count" });
        }
        return res.status(200).json({ message: "Published episode count retrieved", count: count });
    });
};


module.exports = chapterCreationController;
