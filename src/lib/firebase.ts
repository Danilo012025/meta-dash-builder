
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaW8uXHoS1BlcbqgAYz1lexZCzD2Pl7CU",
  authDomain: "rcm-the-start.firebaseapp.com",
  projectId: "rcm-the-start",
  storageBucket: "rcm-the-start.firebasestorage.app",
  messagingSenderId: "326145177001",
  appId: "1:326145177001:web:03dff4892e377a9e5900b8",
  measurementId: "G-WZG9TNQ5V6",
  databaseURL: "https://rcm-the-start-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Realtime Database and handle potential errors
let database;
try {
  database = getDatabase(app);
} catch (error) {
  console.error("Firebase Database initialization error:", error);
  // Create a dummy database object to prevent crashes
  database = {
    ref: () => ({
      on: () => {},
      off: () => {},
      once: () => Promise.resolve({ val: () => null, exists: () => false }),
      set: () => Promise.resolve()
    })
  };
}

export { database };
export default app;
