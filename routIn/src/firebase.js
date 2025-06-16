import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Add this
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuc120f_tFIJN6wgZxWdqdkplzypehRdA",
  authDomain: "routin-eb6c0.firebaseapp.com",
  projectId: "routin-eb6c0",
  storageBucket: "routin-eb6c0.firebasestorage.app",
  messagingSenderId: "691606096057",
  appId: "1:691606096057:web:7b4808a96dbcc374137368",
  measurementId: "G-WN16B2MFVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // ✅ Add and export Firestore
