// controllers/googleSignupController.js
const UserGoogle = require('../models/userGoogle');

exports.signupGoogle = (req, res) => {
  const userData = req.body.token; // Extracted user data from Firebase token

  // Call the model to insert user data into the user_google table
  UserGoogle.insertUserGoogle(userData, (error, result) => {
    if (error) {
      console.error('Error inserting user_google data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json({ message: 'User data inserted successfully.' });
  });
};