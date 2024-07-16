import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    databaseURL: config.public.databaseUrl,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBuck,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const analytics = getAnalytics(app);

  nuxtApp.provide('firebase', { app, auth, firestore, analytics });
});
