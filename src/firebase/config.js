import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Detect if active Firebase keys are placeholders or if force mock is enabled in localStorage
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isMock = !apiKey || 
  apiKey.includes('mock-') || 
  apiKey.trim() === '' || 
  localStorage.getItem('taskflow_force_mock') === 'true';


let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (!isMock) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  } catch (err) {
    console.error("Firebase SDK failed to initialize:", err);
  }
}

export { app, auth, db, googleProvider, isMock };

