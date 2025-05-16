import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFCcoL1MqqmzxSLRHYcdaQfPM43ybOtC4",
    authDomain: "expense-tracker-8c122.firebaseapp.com",
    projectId: "expense-tracker-8c122",
    storageBucket: "expense-tracker-8c122.firebasestorage.app",
    messagingSenderId: "311054054849",
    appId: "1:311054054849:web:5798b1d3a0e2bc6b41eb40",
    measurementId: "G-WQL1VW21VZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };