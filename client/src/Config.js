// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app"; 
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXjxvmtpj1vhZyMnNw6kRsuZ8GLMP3-EE",
  authDomain: "social-18e85.firebaseapp.com",
  projectId: "social-18e85",
  storageBucket: "social-18e85.appspot.com",
  messagingSenderId: "51996675676",
  appId: "1:51996675676:web:8b478d24ca8c8a1663a099",
  measurementId: "G-ZD7JD5VRCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const imageDb = getStorage(app);