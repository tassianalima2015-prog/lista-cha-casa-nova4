// script.js (arquivo em módulo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, onSnapshot, runTransaction, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyB9gTaojRXu7J7g7yI7Hw_9lb3yDMr1ydg",
  authDomain: "cha-de-casa-nova-9034c.firebaseapp.com",
  projectId: "cha-de-casa-nova-9034c",
  storageBucket: "cha-de-casa-nova-9034c.firebasestorage.app",
  messagingSenderId: "396610857130",
  appId: "1:396610857130:web:14590d41081486e57048d3",
  measurementId: "G-Y8GJQB19PR"
};

const app = initializeApp(firebaseConfig);
const db =
