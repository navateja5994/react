import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC8j5LeJ7zT4Yl_UsF3nz3UjiRPAG2vM08",
  authDomain: "eenavis.firebaseapp.com",
  projectId: "eenavis",
  storageBucket: "eenavis.firebasestorage.app",
  messagingSenderId: "852638416682",
  appId: "1:852638416682:web:e6c487205b3d042a1ae853",
  measurementId: "G-ER29PTQV5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app);

export { auth, googleProvider, database };
