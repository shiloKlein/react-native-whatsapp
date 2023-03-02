// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


export const getFirebaseApp = ()=>{
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUbhI5zpXmOYW07Ff6i-a1UpHj9rMCQoA",
    authDomain: "whatsapp-17418.firebaseapp.com",
    projectId: "whatsapp-17418",
    storageBucket: "whatsapp-17418.appspot.com",
    messagingSenderId: "264393209307",
    appId: "1:264393209307:web:8783ac664ecb6a152ee3fe"
  };
  
  // Initialize Firebase
  return initializeApp(firebaseConfig);
}