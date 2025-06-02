import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config (same for both admin and user as provided)
const firebaseConfig = {
  apiKey: "AIzaSyC8j5LeJ7zT4Yl_UsF3nz3UjiRPAG2vM08",
  authDomain: "eenavis.firebaseapp.com",
  databaseURL: "https://eenavis-default-rtdb.firebaseio.com",
  projectId: "eenavis",
  storageBucket: "eenavis.firebasestorage.app",
  messagingSenderId: "852638416682",
  appId: "1:852638416682:web:e6c487205b3d042a1ae853",
  measurementId: "G-ER29PTQV5F"
};

// Initialize User Firebase app
const userApp = initializeApp(firebaseConfig, "userApp");
const userAuth = getAuth(userApp);
const userDb = getFirestore(userApp);
const userStorage = getStorage(userApp);

// Initialize Admin Firebase app (using same config)
const adminApp = initializeApp(firebaseConfig, "adminApp");
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);
const adminStorage = getStorage(adminApp);

export {
  userApp,
  userAuth,
  userDb,
  userStorage,
  adminApp,
  adminAuth,
  adminDb,
  adminStorage
};
