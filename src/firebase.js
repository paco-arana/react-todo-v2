// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU9XpGvVe7OXE4T3hmWfCP-7pUkZZ0kwg",
  authDomain: "todo-app-tests-f9975.firebaseapp.com",
  projectId: "todo-app-tests-f9975",
  storageBucket: "todo-app-tests-f9975.appspot.com",
  messagingSenderId: "700610848161",
  appId: "1:700610848161:web:47ebfacc9b145cc86257e0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
