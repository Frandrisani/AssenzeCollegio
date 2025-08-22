import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // --- MESSAGGIO DI DEBUG 1 ---
      // Questo ci dice se il login con Google ha avuto successo.
      console.log(
        "✅ [firebase.js] Login RIUSCITO con signInWithPopup. User:",
        result.user.displayName
      );
    })
    .catch((error) => {
      // --- MESSAGGIO DI DEBUG 2 ---
      // Questo ci mostra eventuali errori durante il popup.
      console.error(
        "❌ [firebase.js] Errore durante il login con signInWithPopup:",
        error
      );
    });
};

export const logout = () => signOut(auth);

export const onAuth = (callback) => onAuthStateChanged(auth, callback);
