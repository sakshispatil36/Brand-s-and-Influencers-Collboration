import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7kbf2UXorH7go11lwhxsAhE2P8xqDQRc",
  authDomain: "collaboration-c6c47.firebaseapp.com",
  databaseURL: "https://collaboration-c6c47-default-rtdb.firebaseio.com",
  projectId: "collaboration-c6c47",
  storageBucket: "collaboration-c6c47.firebasestorage.app",
  messagingSenderId: "600883996550",
  appId: "1:600883996550:web:39422fde54901bfd75ee07"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);