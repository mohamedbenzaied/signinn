import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAbhRjf6por-6vDQbIRik0MPSJWkg9_LZY",
  authDomain: "filmrare-717e5.firebaseapp.com",
  databaseURL: "https://filmrare-717e5-default-rtdb.firebaseio.com",
  projectId: "filmrare-717e5",
  storageBucket: "filmrare-717e5.appspot.com",
  messagingSenderId: "897026345506",
  appId: "1:897026345506:web:2e45a0cd651ed8ed81d87b",
  measurementId: "G-3LT877SKT0"
});

export const auth = app.auth();
export default app;

export const provider = new firebase.auth.GoogleAuthProvider();
