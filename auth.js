const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dbConn = require('./app/config/db.config'); // Update with the correct path to your db.config file
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:8000/auth/google/callback",
  callbackURL: "http://3.145.100.103:8000/auth/google/callback",
  passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
  const userProfile = profile._json;

  // Check if a matching record exists in the local database
  const query = `SELECT * FROM user_google WHERE sub = '${userProfile.sub}'`;

  dbConn.query(query, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return done(err);
    }

    if (results.length === 0) {
      // No match found, insert data into the database
      const insertQuery = `
        INSERT INTO user_google (sub, name, given_name, family_name, picture, email, email_verified, locale)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertValues = [
        userProfile.sub,
        userProfile.name,
        userProfile.given_name,
        userProfile.family_name,
        userProfile.picture,
        userProfile.email,
        userProfile.email_verified,
        userProfile.locale,
      ];

      dbConn.query(insertQuery, insertValues, (err) => {
        if (err) {
          console.error('MySQL insert error:', err);
          return done(err);
        }

        done(null, profile);
      });
    } else {
      // Match found, respond with "Successfully Logged In"
      done(null, profile);
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
