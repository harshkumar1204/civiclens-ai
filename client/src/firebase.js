import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDveoViPZIDWdgefSGWro45sAKlMPc_YfU",
  authDomain: "civiclens-ai-12469.firebaseapp.com",
  projectId: "civiclens-ai-12469",
  storageBucket: "civiclens-ai-12469.firebasestorage.app",
  messagingSenderId: "845399606055",
  appId: "1:845399606055:web:6504cb31f84baa9806df02",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;