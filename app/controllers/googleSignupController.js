// app/controllers/googleSignupController.js
const passport = require('passport');

// Redirect the user to the Google OAuth authentication page
exports.redirectToGoogleAuth = (req, res) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res);
};

// Handle the Google OAuth callback and insert user data into the database
exports.handleGoogleAuthCallback = (req, res) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      // Handle authentication error
      return res.status(500).json({
        message: 'An error occurred during Google authentication.',
        error: err,
      });
    }

    // Access the user data returned from Google authentication
    const { email } = user;

    // Insert the user data into the database (modify as needed)
    const dbConn = require('../../db.config');
    const newUser = { email };

    dbConn.query('INSERT INTO users SET ?', newUser, (dbErr, result) => {
      if (dbErr) {
        console.log('Error inserting user:', dbErr);
        return res.status(500).json({
          message: 'An error occurred while inserting the user.',
          error: dbErr,
        });
      }

      console.log('User created:', { id: result.insertId, ...newUser });
      return res.status(201).json({ id: result.insertId, ...newUser });
    });
  })(req, res);
};
