import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAJMXOxCAwGKHXT18S4YGn0U2YXZn8ZJDQ",
    authDomain: "nymos-chat-system.firebaseapp.com",
    databaseURL:"https://nymos-chat-system-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nymos-chat-system",
    storageBucket: "nymos-chat-system.appspot.com",
    messagingSenderId: "281362018080",
    appId: "1:281362018080:web:32fd8f7200406ec96cb145",
    measurementId: "G-RC6FT5RC6P"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const analytics = getAnalytics(app);

  nuxtApp.provide('firebase', { app, auth, firestore, analytics });
});
