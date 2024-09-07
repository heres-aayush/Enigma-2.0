var admin = require("firebase-admin");

var serviceAccount = require("4e602520325f35061bdab977087d357891190f72.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
