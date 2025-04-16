
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://your-project-id.firebaseio.com" // Updated with correct format
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
