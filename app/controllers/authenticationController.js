const UserModel = require('../models/userLoginModel');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const jwkToPem = require('jwk-to-pem');

const authenticationController = {};

async function fetchGooglePublicKeys() {
  const url = 'https://www.googleapis.com/oauth2/v3/certs';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch Google public keys');
  }
  const keys = await response.json();
  console.log(keys)

  // Format fetched keys into PEM format for JWT verification
  const formattedKeys = {};
  for (const key of keys.keys) {
    const pem = jwkToPem(key);
    formattedKeys[key.kid] = pem;
    console.log(pem)
  }
  return formattedKeys;
}

authenticationController.createUserByGoogle = async (req, res) => {
  const { token } = req.query;

  // Check if token is provided in the query parameter
  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  try {
    const keys = await fetchGooglePublicKeys();
    const decodedToken = jwt.verify(token, keys, { algorithms: ['RS256'] });

    // Token is valid, use the decoded token payload for further processing
    // For example, you can access the email: decodedToken.email

    return res.status(200).json({ message: 'Token decoded successfully', decodedToken });
  } catch (err) {
    console.log('JWT Verification Error:', err);
    // Handle token verification errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authenticationController;
