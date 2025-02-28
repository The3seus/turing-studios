// firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase_config.json'); // Replace with your service account key file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET // Add your Firebase storage bucket URL to your .env file
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
