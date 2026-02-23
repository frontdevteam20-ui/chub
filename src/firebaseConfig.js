import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
