
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6p3ykaccCLuiH6jm8NP8wPKDc7NW9ltA",
  authDomain: "portfolio-dash-00.firebaseapp.com",
  projectId: "portfolio-dash-00",
  storageBucket: "portfolio-dash-00.firebasestorage.app",
  messagingSenderId: "841618368132",
  appId: "1:841618368132:web:8525c942639c95580684d1",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
