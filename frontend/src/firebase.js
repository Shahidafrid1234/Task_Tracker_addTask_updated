import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACoZyx1dGTPs-LGyX09XDyzRXlu0Hlpmk",
  authDomain: "task-tracker-hub-9ea86.firebaseapp.com",
  projectId: "task-tracker-hub-9ea86",
  storageBucket: "task-tracker-hub-9ea86.firebasestorage.app",
  messagingSenderId: "221760049282",
  appId: "1:221760049282:web:37b5f76805610edff5249b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
