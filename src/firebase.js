// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCVEO7nO6mrrzizIyXZPNpGaqcdARcnCMI",
    authDomain: "projmasys.firebaseapp.com",
    databaseURL: "https://projmasys-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "projmasys",
    storageBucket: "projmasys.appspot.com",
    messagingSenderId: "320057481570",
    appId: "1:320057481570:web:1d1a262dc84ab3610d743b",
    measurementId: "G-FZ27DQD039"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);


export const auth = getAuth(app);
export { db, storage,database,collection, addDoc, ref, uploadBytes, getDownloadURL };