import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9xZfTqR5GLDhPSg7aquthXtC-i3ZQsUE",
  authDomain: "hexpresso-5d0d6.firebaseapp.com",
  projectId: "hexpresso-5d0d6",
  storageBucket: "hexpresso-5d0d6.firebasestorage.app",
  messagingSenderId: "503552610366",
  appId: "1:503552610366:web:6baad630da9010c286816f",
  measurementId: "G-2HVPF0L7CE"
};

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
const initializeAuth = (firebaseAuth as any).initializeAuth;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: reactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { auth, db };

