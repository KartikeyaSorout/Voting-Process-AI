'use strict';
/**
 * ElectIQ — Firebase Configuration
 * Initializes Firebase services: Auth, Firestore, Analytics.
 * @module firebase-config
 */

const firebaseConfig = {
  apiKey: "AIzaSyCX50gML5ePrjTmQZFUxsxAcb5vm1Zk64Y",
  authDomain: "voting-process-ai.firebaseapp.com",
  projectId: "voting-process-ai",
  storageBucket: "voting-process-ai.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/** @type {firebase.auth.Auth} Firebase Auth instance */
const auth = firebase.auth();

/** @type {firebase.firestore.Firestore} Firestore instance */
const db = firebase.firestore();

// Initialize Analytics (if configured)
try {
  if (firebaseConfig.measurementId && !firebaseConfig.measurementId.startsWith("G-XX")) {
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
