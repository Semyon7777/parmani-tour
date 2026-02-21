// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4ZAbj-y3ZsAVvMnTOfN54R945DH5yGbU",
  authDomain: "armenia-journey.firebaseapp.com",
  projectId: "armenia-journey",
  storageBucket: "armenia-journey.appspot.com",
  messagingSenderId: "320753088133",
  appId: "1:320753088133:web:5f47d92a99cd8f65985bec",
  measurementId: "G-G7GKJEQRPX"
};

// Initialize Firebase
const Reg = initializeApp(firebaseConfig);

export default Reg;