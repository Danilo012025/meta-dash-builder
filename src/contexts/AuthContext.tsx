
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
        console.error("Signup error:", error);
        let errorMessage = "Erro ao criar conta";
        
        // Tratando erros específicos
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "Este email já está em uso";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "A senha é muito fraca";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Email inválido";
        } else if (error.code === "auth/operation-not-allowed") {
          errorMessage = "Cadastro de usuários não está habilitado";
        } else if (error.code === "auth/configuration-not-found") {
          errorMessage = "Erro de configuração no Firebase";
        }
        
        toast.error(errorMessage);
        throw error;
      });
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Login realizado com sucesso!");
      })
      .catch(error => {
        console.error("Login error:", error);
        let errorMessage = "Falha no login";
        
        // Tratando erros específicos
        if (error.code === "auth/user-not-found") {
          errorMessage = "Usuário não encontrado";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Senha incorreta";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Email inválido";
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "Usuário desativado";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Muitas tentativas. Tente novamente mais tarde";
        } else if (error.code === "auth/configuration-not-found") {
          errorMessage = "Erro de configuração no Firebase";
        }
        
        toast.error(errorMessage);
        throw error;
      });
  }

  function logout() {
    return signOut(auth)
      .then(() => {
        toast.info("Logout realizado");
      })
      .catch(error => {
        console.error("Logout error:", error);
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
