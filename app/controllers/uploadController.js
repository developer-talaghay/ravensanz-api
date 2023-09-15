// controllers/uploadController.js
const PictureUploadModel = require('../models/uploadModel');
const multer = require("multer");
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './profile_picture/'); // Set the destination folder for profile pictures
    },
    filename: function (req, file, cb) {
      const { user_id } = req.body;
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, "");
      const fileName = `${currentDate}${timestamp}_${user_id}.png`;
      cb(null, fileName);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .jpg and .png files are allowed!'));
    }
  },
  limits: {
    fileSize: 6 * 1024 * 1024, // 6MB limit
  },
}).single('picture');

exports.uploadPicture = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    // Check if required fields are empty
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).send("user_id is required");
    }

    if (!req.file) {
      return res.status(400).send("No picture provided");
    }

    const picture_directory = path.join('./profile_picture', req.file.filename);
    console.log(picture_directory)

    // Update the picture_directory in the database
    PictureUploadModel.uploadPicture(user_id, picture_directory, (updateError, result) => {
      if (updateError) {
        console.error("Error updating picture_directory in the database: ", updateError);
        return res.status(500).send({ message: "Error updating picture_directory in the database" });
      }

      res.status(200).json(result);
    });
  });
};
