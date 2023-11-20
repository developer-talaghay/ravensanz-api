var admin = require("firebase-admin");

var serviceAccount = require("./ravensanz-10b88-firebase-adminsdk-x8ks2-979e958a37.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
