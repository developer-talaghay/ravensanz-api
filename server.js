const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Google OAuth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: '1001534039958-8bfqeo9ls4mif2i0bt38hdr9t761d4ui.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/api/v1/google-signup/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Extract necessary user data from the Google profile
      const user = {
        email: profile.emails[0].value,
        // Add any other necessary fields
      };

      // Handle the user data in the callback
      done(null, user);
    }
  )
);

app.use(passport.initialize());

// Routes
const googleSignupRoute = require('./app/routes/googleSignUpRoutes');
const userSignupRoute = require('./app/routes/userSignupRoutes');
const userLoginRoute = require('./app/routes/userLoginRoutes');
const userResetPasswordRoute = require('./app/routes/userResetPasswordRoutes');
const userVerificationRoute = require("./app/routes/userVerificationRoute");

app.use('/api/v1/google-signup', googleSignupRoute);
app.use('/api/v1/signup', userSignupRoute);
app.use('/api/v1/login', userLoginRoute);
app.use('/api/v1', userResetPasswordRoute);
app.use('/',userVerificationRoute)

// Default route
app.get('/', (req, res) => {
  res.send("It's working");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
