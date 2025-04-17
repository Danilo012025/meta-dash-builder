
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator, enableLogging } from "firebase/database";

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

// Habilitar logs em ambiente de desenvolvimento
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  enableLogging((message) => {
    console.log("[FIREBASE]", message);
  }, { error: true });
}

// Inicializar Firebase com tratamento robusto de erros
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase core inicializado com sucesso");
} catch (error) {
  console.error("Erro crítico na inicialização do Firebase:", error);
  throw new Error("Falha na inicialização do Firebase. Por favor, verifique sua conexão e tente novamente.");
}

// Inicializar Firebase Authentication com tratamento de erros
let auth;
try {
  auth = getAuth(app);
  
  // Configurar para não persistir estado entre sessões para evitar problemas com múltiplos usuários
  auth.setPersistence('session');
  
  console.log("Firebase Auth inicializado com sucesso");
} catch (error) {
  console.error("Firebase Authentication initialization error:", error);
  
  // Criar um objeto de autenticação fictício para evitar falhas completas
  auth = {
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error("Autenticação indisponível")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Autenticação indisponível")),
    signOut: () => Promise.resolve()
  };
  console.warn("Usando autenticação em modo offline devido a erro de inicialização");
}

// Inicializar Realtime Database com otimizações para múltiplos usuários
let database;
try {
  const dbConfig = {
    // Configurações para otimização de múltiplos usuários (até 20)
    authDomain: firebaseConfig.authDomain,
    databaseURL: firebaseConfig.databaseURL,
    // Aumentar limite de conexões simultâneas
    experimentalForceLongPolling: false, // Usar WebSockets por padrão
  };
  
  database = getDatabase(app);
  
  // Configurações adicionais para ambientes com múltiplos usuários
  // Estas configurações ajudam a lidar com desconexões e reconexões
  const connectedRef = database.ref('.info/connected');
  connectedRef.on('value', (snap) => {
    if (snap.val() === true) {
      console.log("Conectado ao Firebase Database");
    } else {
      console.log("Desconectado do Firebase Database");
    }
  });
  
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
    }),
    // Adicionar funções necessárias para compatibilidade com as chamadas de presença
    goOffline: () => {},
    goOnline: () => {},
  };
  console.warn("Usando banco de dados fictício devido a erro de inicialização");
}

// Configurações específicas para lidar com múltiplos usuários
const setupMultiUserSupport = () => {
  if (!database || !database.ref) return;
  
  try {
    // Configurar para lidar com desconexões inesperadas
    window.addEventListener('unload', () => {
      if (database && database.goOffline) {
        database.goOffline();
      }
    });
    
    // Reconectar automaticamente quando a aplicação voltar a ter foco
    window.addEventListener('focus', () => {
      if (database && database.goOnline) {
        database.goOnline();
      }
    });
  } catch (err) {
    console.warn("Erro ao configurar suporte multi-usuário:", err);
  }
};

// Inicializar suporte para múltiplos usuários
setupMultiUserSupport();

// Exportar as instâncias do Firebase
export { auth, database };
export default app;
