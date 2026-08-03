import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (Substitua pelos seus dados do console do Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCLLi1_Si8hUTa-oTjiQqkQzOueae7LUFY",
  authDomain: "bella-10ebe.firebaseapp.com",
  projectId: "bella-10ebe",
  storageBucket: "bella-10ebe.firebasestorage.app",
  messagingSenderId: "1044478446428",
  appId: "1:1044478446428:web:bbd9ff8ed0c0c768104f99"
};

// Inicializa o Firebase (Evita inicialização múltipla no Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
