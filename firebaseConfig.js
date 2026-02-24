import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Add this import

// Correct Firebase configuration for tcerp-newversion project
const firebaseConfig = {
  apiKey: "AIzaSyA3Ln4ByzURA8drIrvka2PYQbPRF_NbVAw",
  authDomain: "tcerp-newversion.firebaseapp.com",
  databaseURL: "https://tcerp-newversion.firebaseio.com",
  projectId: "tcerp-newversion",
  storageBucket: "tcerp-newversion.appspot.com",
  messagingSenderId: "595044081279",
  appId: "1:595044081279:web:3320af7c412fbc33bb694a",
};

// Initialize Firebase - FIXED VERSION
let app;
const existingApps = getApps();
if (existingApps.length > 0) {
  app = existingApps[0]; // Use existing app
} else {
  app = initializeApp(firebaseConfig); // Initialize new app
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);

// Initialize Analytics (only on the client-side) - DISABLED TEMPORARILY
let analytics;
if (typeof window !== "undefined") {
  // isSupported().then((supported) => {
  //   if (supported) {
  //     analytics = getAnalytics(app);
  //   }
  // });
}

export { analytics };