
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { database } from "@/lib/firebase";
import { ref, set, onValue } from "firebase/database";

export default function Login() {
  const { currentUser, login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [systemStatus, setSystemStatus] = useState<"online" | "offline" | "checking">("checking");
  const navigate = useNavigate();
  
  // Verificar status do sistema
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Testar conexão com Firebase
        const connectedRef = ref(database, '.info/connected');
        
        // Criar um listener para verificar a conexão
        const unsubscribe = onValue(connectedRef, (snap) => {
          if (snap.exists() && snap.val() === true) {
            setSystemStatus("online");
            
            // Registrar status do sistema
            try {
              const statusRef = ref(database, 'systemStatus');
              set(statusRef, {
                lastCheck: new Date().toISOString(),
                status: "online"
              });
            } catch (statusError) {
              console.error("Erro ao registrar status:", statusError);
            }
          } else {
            setSystemStatus("offline");
          }
        }, (error) => {
          console.error("Erro ao verificar status da conexão:", error);
          setSystemStatus("offline");
        });
        
        return () => {
          // Limpar listener quando o componente for desmontado
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error("Erro ao configurar verificação de status:", error);
        setSystemStatus("offline");
      }
    };
    
    checkSystemStatus();
    
    // Verificar status de conexão periodicamente
    const handleOnline = () => setSystemStatus("online");
    const handleOffline = () => setSystemStatus("offline");
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Se o usuário já estiver autenticado, redirecionar para o dashboard
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    if (systemStatus === "offline") {
      toast.error("Você está offline. Verifique sua conexão.");
      return;
    }
    
    setIsLoading(true);
    try {
      if (login) {
        await login(email, password);
        toast.success("Login realizado com sucesso");
        navigate("/");
      } else {
        throw new Error("Função de login não disponível");
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
      let message = "Erro ao fazer login. Tente novamente.";
      
      if (error.code === 'auth/user-not-found') {
        message = "Usuário não encontrado. Verifique seu email.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Senha incorreta. Tente novamente.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Muitas tentativas. Tente novamente mais tarde.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Problema de conexão. Verifique sua internet.";
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    if (systemStatus === "offline") {
      toast.error("Você está offline. Verifique sua conexão.");
      return;
    }
    
    setIsLoading(true);
    try {
      if (signup) {
        await signup(email, password);
        toast.success("Cadastro realizado com sucesso");
        navigate("/");
      } else {
        throw new Error("Função de cadastro não disponível");
      }
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      let message = "Erro ao criar conta. Tente novamente.";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "Este email já está em uso. Tente fazer login.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Email inválido. Verifique o formato.";
      } else if (error.code === 'auth/weak-password') {
        message = "Senha fraca. Use pelo menos 6 caracteres.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Cadastro não habilitado. Entre em contato com o administrador.";
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverSystem = async () => {
    setIsRecovering(true);
    try {
      // Limpar cache do navegador para o domínio
      localStorage.removeItem('firebase:previous_websocket_failure');
      
      // Forçar recarga da página
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (error) {
      console.error("Erro ao recuperar sistema:", error);
      setIsRecovering(false);
      toast.error("Erro ao tentar recuperar o sistema");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-title text-brand-neon text-center">
              The Start Agência
            </CardTitle>
            
            {systemStatus === "offline" && (
              <div className="mt-2 bg-red-900/30 border border-red-700 text-red-400 text-center p-2 rounded-md text-sm">
                Sistema offline. Verifique sua conexão com a internet.
                <Button 
                  onClick={handleRecoverSystem} 
                  variant="outline" 
                  size="sm"
                  className="mt-2 w-full"
                  disabled={isRecovering}
                >
                  {isRecovering ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Recuperando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Tentar recuperar conexão
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-secondary text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground" htmlFor="password">
                      Senha
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-secondary text-white"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-neon text-brand-black hover:bg-opacity-80"
                    disabled={isLoading || systemStatus === "offline"}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : "Entrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground" htmlFor="signup-email">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-secondary text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground" htmlFor="signup-password">
                      Senha
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-secondary text-white"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-neon text-brand-black hover:bg-opacity-80"
                    disabled={isLoading || systemStatus === "offline"}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : "Cadastrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
