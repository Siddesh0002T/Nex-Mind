// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, push, get, child } from "firebase/database"; // Import Realtime Database functions

const firebaseConfig = {
    apiKey: "AIzaSyAF-5lkt_7679wjn0mXzPAMlp55pcwQ4oo",
    authDomain: "nex-mind.firebaseapp.com",
    projectId: "nex-mind",
    storageBucket: "nex-mind.firebasestorage.app",
    messagingSenderId: "702224907563",
    appId: "1:702224907563:web:a381390f9ca3794861596e",
    measurementId: "G-NSMHN1WTCF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Realtime Database
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app); // Initialize Realtime Database
