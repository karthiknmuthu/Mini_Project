// Import the functions you need from the SDKs you need
import { getApps,getApp,initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDO8eIxcTTpU6L0YaltXvgSIYcLk7FrHio",
  authDomain: "travelpal-923cd.firebaseapp.com",
  databaseURL: "https://travelpal-923cd-default-rtdb.firebaseio.com",
  projectId: "travelpal-923cd",
  storageBucket: "travelpal-923cd.appspot.com",
  messagingSenderId: "135492285318",
  appId: "1:135492285318:web:e03e61344c1da184153207",
  measurementId: "G-DSGV5TXSZP"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };