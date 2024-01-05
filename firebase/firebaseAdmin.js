const admin = require("firebase-admin");

const serviceAccount = require("./rs-stories-15f7e-firebase-adminsdk-hju21-fb35854838.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

});

module.exports = admin;
