// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkhFGsKbZdmMN0AObvNpn4Pe_IvRDvclI",
  authDomain: "dailymental-1069c.firebaseapp.com",
  projectId: "dailymental-1069c",
  storageBucket: "dailymental-1069c.firebasestorage.app",
  messagingSenderId: "799452727392",
  appId: "1:799452727392:web:a85cdc79562b823cb05b05",
  measurementId: "G-5K6L8J2Z55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
