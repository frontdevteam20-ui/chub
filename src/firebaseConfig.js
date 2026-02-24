import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3Ln4ByzURA8drIrvka2PYQbPRF_NbVAw",
  authDomain: "tech-cloud-erp-1532582683650.firebaseapp.com",
  databaseURL: "https://tech-cloud-erp-1532582683650.firebaseio.com",
  projectId: "tech-cloud-erp-1532582683650",
  storageBucket: "tech-cloud-erp-1532582683650.appspot.com",
  messagingSenderId: "595044081279",
  appId: "1:595044081279:web:3320af7c412fbc33bb694a",
  measurementId: "G-YSB4T0X2FK"
};

// Initialize Firebase with duplicate app handling
let app;
const existingApps = getApps();
if (existingApps.length > 0) {
  app = existingApps[0]; // Use existing app
} else {
  app = initializeApp(firebaseConfig); // Initialize new app
}

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
