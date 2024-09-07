// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2n55F2qlS8mGHc0qaWybZXgmrJGruIbk",
  authDomain: "enigma2-e9dd0.firebaseapp.com",
  projectId: "enigma2-e9dd0",
  storageBucket: "enigma2-e9dd0.appspot.com",
  messagingSenderId: "985817926481",
  appId: "1:985817926481:web:328470989f811e5137a170"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);