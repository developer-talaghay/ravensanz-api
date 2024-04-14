// adminController.js
const AdminModel = require("../models/adminModel");
const formidable = require('formidable');
const adminController = {};
const querystring = require('querystring');  // Add this if not already imported

adminController.createStory = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({ message: "Error parsing form data" });
        }

        // Decode each field using querystring.unescape
        const decodedFields = {};
        Object.keys(fields).forEach(key => {
            decodedFields[key] = querystring.unescape(fields[key]);
        });

        const { userId, title, blurb, language, genre, status } = decodedFields;

        if (!userId || !title || !blurb || !language || !genre || !status) {
            return res.status(400).json({ message: "Missing required fields in request body" });
        }

        AdminModel.createStory(userId, title, blurb, language, genre, status, (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Internal server error" });
            } else {
                return res.status(201).json({ message: "Story created successfully", episodeId: result.episodeId });
            }
        });
    });
};


module.exports = adminController;
