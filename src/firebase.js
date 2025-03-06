// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBeUslS2RTqKZ6CJku7fE_2knYbRcZYXW0",
    authDomain: "uptd-psaa.firebaseapp.com",
    projectId: "uptd-psaa",
    storageBucket: "uptd-psaa.firebasestorage.app",
    messagingSenderId: "244570092804",
    appId: "1:244570092804:web:5bc1721f00a922d7c64c51",
    measurementId: "G-KVW0KJDX2P"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db,auth };