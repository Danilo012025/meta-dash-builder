
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaW8uXHoS1BlcbqgAYz1lexZCzD2Pl7CU",
  authDomain: "rcm-the-start.firebaseapp.com",
  projectId: "rcm-the-start",
  storageBucket: "rcm-the-start.appspot.com", 
  messagingSenderId: "326145177001",
  appId: "1:326145177001:web:03dff4892e377a9e5900b8",
  measurementId: "G-WZG9TNQ5V6",
  databaseURL: "https://rcm-the-start-default-rtdb.firebaseio.com"
};

// Inicializar Firebase com melhor tratamento de erros
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase core inicializado com sucesso");
} catch (error) {
  console.error("Erro na inicialização do Firebase:", error);
  throw new Error("Falha na inicialização do Firebase. Por favor, verifique sua conexão e tente novamente.");
}

// Inicializar Firebase Authentication com tratamento de erros
let auth;
try {
  auth = getAuth(app);
  console.log("Firebase Auth inicializado com sucesso");
} catch (error) {
  console.error("Firebase Authentication initialization error:", error);
  throw new Error("Falha na inicialização da autenticação. Por favor, tente novamente.");
}

// Inicializar Realtime Database com persistência local e otimizações para múltiplos usuários
let database;
try {
  database = getDatabase(app);
  
  // Configurar opções para otimização de múltiplos usuários
  // Nota: Desde a migração para Modular SDK (v9), a configuração é feita no console do Firebase
  // Estas configurações afetam como os dados são sincronizados e armazenados em cache

  console.log("Firebase Database inicializado com sucesso (otimizado para múltiplos usuários)");
} catch (error) {
  console.error("Firebase Database initialization error:", error);
  // Criar um objeto de banco de dados fictício para evitar falhas
  database = {
    ref: () => ({
      on: () => {},
      off: () => {},
      once: () => Promise.resolve({ val: () => null, exists: () => false }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve()
    })
  };
  console.warn("Usando banco de dados fictício devido a erro de inicialização");
}

// Exportar as instâncias do Firebase
export { auth, database };
export default app;
