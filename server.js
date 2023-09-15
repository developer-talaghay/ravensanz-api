const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const sequelize = require('./app/config/db.config.sequelize');
const dbConn = require('./app/config/db.config'); // Update with the correct path to your db.config file
const session = require('express-session')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

app.use('/images', express.static(__dirname + '/profile_picture'));
console.log(`express.static: ${__dirname + '/profile_picture'}`);

require('./auth')

sequelize.sync()
  .then(() => {
    console.log('Database synchronized with models');
  })
  .catch(error => {
    console.error('Error synchronizing database:', error);
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
const userSignupRoute = require('./app/routes/userSignupRoutes');
const userLoginRoute = require('./app/routes/userLoginRoutes');
const userResetPasswordRoute = require('./app/routes/userResetPasswordRoutes');
const userVerificationRoute = require("./app/routes/userVerificationRoute");
const storyRoute = require("./app/routes/story");
const clientRoute = require("./app/routes/clientRoutes");
const userRoute = require("./app/routes/userRoutes");
const uploadPictureRoute = require("./app/routes/uploadRoutes");

app.use('/api/v1/signup', userSignupRoute);
app.use('/api/v1/login', userLoginRoute);
app.use('/api/v1', userResetPasswordRoute);
app.use('/',userVerificationRoute)
app.use('/api/v1/story', storyRoute);
app.use('/api/v1/client', clientRoute);
app.use('/api/v1/user/details', userRoute);
app.use('/api/v1/upload', uploadPictureRoute);


function isLoggedIn(req,res,next){
  req.user ? next() : res.sendStatus(401)
}

// Default route
app.get('/', (req, res) => {
  res.send("It's working");
});


// google OAUTH

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/protected',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/protected', isLoggedIn, (req, res) => {
  const userProfile = req.user._json;

  const responseText = `
    sub: ${userProfile.sub} 
    name: ${userProfile.name}
    given_name: ${userProfile.given_name}
    family_name: ${userProfile.family_name}
    picture: ${userProfile.picture}
    email: ${userProfile.email}
    email_verified: ${userProfile.email_verified}
    locale: ${userProfile.locale}
  `;

  const sub = userProfile.sub;

  // Check if a matching record exists in the local database
  const query = `SELECT * FROM user_google WHERE sub = '${sub}'`;

  dbConn.query(query, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      // No match found, respond with "Signed up successfully"
      res.send('Signed up successfully\n' + responseText);
    } else {
      // Match found, respond with "Login Successful"
      res.send('Login Successful\n' + responseText);
    }
  });
});

app.get('/auth/google/failure', (req, res)=>{
  res.send("Something went wrong")
})

app.get('/auth/google/logout', (req, res)=>{
  req.session.destroy();
  res.send("Logged Out");
})



// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
