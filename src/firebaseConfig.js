// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Export Auth and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
