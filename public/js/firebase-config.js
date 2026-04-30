'use strict';
/**
 * ElectIQ — Firebase Configuration
 * Initializes Firebase services: Auth, Firestore, Analytics.
 * @module firebase-config
 */

const firebaseConfig = {
  apiKey: "AIzaSyCX50gML5ePrjTmQZFUxsxAcb5vm1Zk64Y",
  authDomain: "election-assistant-936d2.firebaseapp.com",
  projectId: "election-assistant-936d2",
  storageBucket: "election-assistant-936d2.firebasestorage.app",
  messagingSenderId: "1016940258966",
  appId: "1:1016940258966:web:65dfd481974d1631c384b7",
  measurementId: "G-GCP6Z5HTSK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/** @type {firebase.auth.Auth} Firebase Auth instance */
window.auth = firebase.auth();

/** @type {firebase.firestore.Firestore} Firestore instance */
window.db = firebase.firestore();

// Initialize Analytics (if configured)
try {
  if (firebaseConfig.measurementId) {
    firebase.analytics();
  }
} catch (e) {
  console.info("Analytics not available:", e.message);
}

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true })
  .catch(function handlePersistenceError(err) {
    if (err.code === 'failed-precondition') {
      console.warn("Persistence: multiple tabs open.");
    } else if (err.code === 'unimplemented') {
      console.warn("Persistence: not supported by browser.");
    }
  });

console.log("✅ Firebase initialized — ElectIQ");
