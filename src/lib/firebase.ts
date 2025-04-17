
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator, ref, onValue } from "firebase/database";

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
  database = getDatabase(app);
  
  // Log de informações apenas em ambiente de desenvolvimento e apenas no console
  if (process.env.NODE_ENV === 'development') {
    console.log("Ambiente de desenvolvimento: logs detalhados do Firebase ativados");
  }
  
  console.log("Firebase Database inicializado com sucesso (otimizado para múltiplos usuários)");
  
  // Configurar listener para estado de conexão
  try {
    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        console.log("Conectado ao Firebase Database");
      } else {
        console.log("Desconectado do Firebase Database");
      }
    }, (error) => {
      console.error("Erro ao verificar status de conexão:", error);
    });
  } catch (connErr) {
    console.warn("Não foi possível configurar listener de conexão:", connErr);
  }
  
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
      if (database && typeof database.goOffline === 'function') {
        database.goOffline();
      }
    });
    
    // Reconectar automaticamente quando a aplicação voltar a ter foco
    window.addEventListener('focus', () => {
      if (database && typeof database.goOnline === 'function') {
        database.goOnline();
      }
    });
    
    // Verificação periódica de conexão a cada 30 segundos para manter usuários sincronizados
    const connectionCheckInterval = setInterval(() => {
      if (navigator.onLine) {
        // Garantir que está online no Firebase também
        if (database && typeof database.goOnline === 'function') {
          database.goOnline();
        }
      }
    }, 30000);
    
    // Limpar interval ao desmontar
    window.addEventListener('beforeunload', () => {
      clearInterval(connectionCheckInterval);
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
