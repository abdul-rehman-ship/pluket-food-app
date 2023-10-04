// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAGiiI_uSIqs1-6Twgu6uMLL3zqXvx3vpE",
    authDomain: "pluket-food-app.firebaseapp.com",
    projectId: "pluket-food-app",
    storageBucket: "pluket-food-app.appspot.com",
    messagingSenderId: "463320249180",
    appId: "1:463320249180:web:a2cfa9f284989c2b810799"
  };

  

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const auth2=getAuth(secondaryApp)

export const db=getFirestore(app)
export const storage=getStorage(app)