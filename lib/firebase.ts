import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, update, remove, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUuCrJxIC76NF_fcjcL33dk2qhMks1ow0",
  authDomain: "school-92721.firebaseapp.com",
  projectId: "school-92721",
  storageBucket: "school-92721.firebasestorage.app",
  messagingSenderId: "575199760636",
  appId: "1:575199760636:web:ae6b7005706288449ec779",
  measurementId: "G-Y7JQ7XP9KC",
  databaseURL: "https://school-92721-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, set, get, update, remove, onValue };
