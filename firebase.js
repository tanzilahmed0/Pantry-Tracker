// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4gYF-ER1RRUN8FHqA5BWquYKahcyvMjs",
  authDomain: "inventory-management-b72c9.firebaseapp.com",
  projectId: "inventory-management-b72c9",
  storageBucket: "inventory-management-b72c9.appspot.com",
  messagingSenderId: "445825848848",
  appId: "1:445825848848:web:23aafc9f56ce6e2d259c95",
  measurementId: "G-4WD78NPWKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};