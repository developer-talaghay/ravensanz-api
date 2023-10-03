// firebaseAuthMiddleware.js
const admin = require('firebase-admin');

module.exports = function (req, res, next) {
  const idToken = req.body.token;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken; // Store the decoded token in the request object
      next(); // Move to the next middleware or route handler
    })
    .catch((error) => {
      // Handle token verification errors
      console.error('Error verifying Firebase token:', error);
      return res.status(403).json({ message: 'Unauthorized' });
    });
};
