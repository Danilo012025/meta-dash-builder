
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { toast } from "@/components/ui/sonner";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Conta criada com sucesso!");
      })
      .catch(error => {
        toast.error("Erro ao criar conta: " + error.message);
        throw error;
      });
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Login realizado com sucesso!");
      })
      .catch(error => {
        toast.error("Falha no login: " + error.message);
        throw error;
      });
  }

  function logout() {
    return signOut(auth)
      .then(() => {
        toast.info("Logout realizado");
      })
      .catch(error => {
        toast.error("Erro ao realizar logout: " + error.message);
        throw error;
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
