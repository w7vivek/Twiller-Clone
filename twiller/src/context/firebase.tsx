import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmn35ew9BUuTlSxyeXQAlNdizsYfbFxSM",
  authDomain: "twiller-1a149.firebaseapp.com",
  projectId: "twiller-1a149",
  storageBucket: "twiller-1a149.firebasestorage.app",
  messagingSenderId: "316200197752",
  appId: "1:316200197752:web:ce1de2e0e47ba6aaa6d78d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export default app;