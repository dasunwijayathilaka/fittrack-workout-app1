import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAq5LPUTtfLoLTaVzUjHiC0qJ3nXOAMs8s",
  authDomain: "fittrack-workout-app.firebaseapp.com",
  projectId: "fittrack-workout-app",
  storageBucket: "fittrack-workout-app.firebasestorage.app",
  messagingSenderId: "1020522724550",
  appId: "1:1020522724550:web:2eedd7d525473465572bc7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
