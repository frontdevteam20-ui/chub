import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase configuration for tcerp-newversion project
const firebaseConfig = {
  apiKey: "AIzaSyA3Ln4ByzURA8drIrvka2PYQbPRF_NbVAw",
  authDomain: "tcerp-newversion.firebaseapp.com",
  databaseURL: "https://tcerp-newversion.firebaseio.com",
  projectId: "tcerp-newversion",
  storageBucket: "tcerp-newversion.appspot.com",
  messagingSenderId: "595044081279",
  appId: "1:595044081279:web:3320af7c412fbc33bb694a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);

// Analytics (disabled for now)
export let analytics = null;
