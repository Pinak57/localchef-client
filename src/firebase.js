// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCR8qcrF-lugwOKIm6pMA6H14m29Hxtkkc",
  authDomain: "localchefbazaar-65e2e.firebaseapp.com",
  projectId: "localchefbazaar-65e2e",
  storageBucket: "localchefbazaar-65e2e.firebasestorage.app",
  messagingSenderId: "993191950623",
  appId: "1:993191950623:web:df259e93fadbed5855582a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);