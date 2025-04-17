
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { HeaderSection } from "./HeaderSection";
import { IndicatorsSection } from "./IndicatorsSection";
import { RevenueGoalsSection } from "./RevenueGoalsSection";
import { ChartsSection } from "./ChartsSection";
import { LeadsTable } from "./LeadsTable";
import { MeetingSummarySection } from "./MeetingSummary";
import { NotesAndRemarketing } from "./NotesAndRemarketing";
import { DashboardData } from "@/types/dashboard";
import { initialDashboardData, updateAllIndicatorsStatus } from "@/data/dashboardData";
import { exportToExcel } from "@/utils/excelExport";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster, toast } from "@/components/ui/sonner";
import { database } from "@/lib/firebase";
import { ref, onValue, set, get, off, update, onDisconnect } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";

export function Dashboard() {
  const [data, setData] = useState<DashboardData>(updateAllIndicatorsStatus(initialDashboardData));
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const { currentUser } = useAuth();
  
  // Função para gerenciar presença do usuário para suporte a múltiplos usuários
  const setupUserPresence = useCallback(() => {
    if (!currentUser) return;
    
    try {
      // Referência para status de conexão
      const connectedRef = ref(database, '.info/connected');
      const userStatusRef = ref(database, `userStatus/${currentUser.uid}`);
      
      // Monitorar status de conexão
      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          setIsConnected(true);
          
          // Quando desconectado, atualizar status
          onDisconnect(userStatusRef).update({
            status: 'offline',
            lastSeen: new Date().toISOString()
          });
          
          // Atualizar status como online
          update(userStatusRef, {
            status: 'online',
            email: currentUser.email,
            lastSeen: new Date().toISOString()
          });
        } else {
          setIsConnected(false);
        }
      });
      
      return () => {
        off(connectedRef);
      };
    } catch (error) {
      console.error("Erro ao configurar presença do usuário:", error);
    }
  }, [currentUser]);

  // Função para inicializar e sincronizar dados com o Firebase
  const syncDashboardData = useCallback(() => {
    try {
      // Referência aos dados do dashboard no Firebase
      const dashboardRef = ref(database, 'dashboard');
      
      // Verificar se já existem dados no Firebase
      get(dashboardRef).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Dados encontrados no Firebase, carregando...");
          const firebaseData = snapshot.val();
          setData(updateAllIndicatorsStatus(firebaseData));
        } else {
          console.log("Nenhum dado encontrado, inicializando com dados padrão");
          // Se não houver dados, inicializar com os dados padrão
          set(dashboardRef, initialDashboardData).catch(err => {
            console.error("Erro ao definir dados iniciais:", err);
            toast.error("Erro ao inicializar dados");
          });
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Erro ao buscar dados iniciais:", error);
        setIsLoading(false);
        // Usar dados locais em caso de falha
        toast.error("Erro ao carregar dados do servidor, usando dados locais");
      });
      
      // Configurar listener para atualizações em tempo real
      const unsubscribe = onValue(dashboardRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const firebaseData = snapshot.val();
            setData(updateAllIndicatorsStatus(firebaseData));
          }
        } catch (error) {
          console.error("Erro ao processar dados do Firebase:", error);
        }
      }, (error) => {
        console.error("Erro no listener do dashboard:", error);
        toast.error("Erro de sincronização, algumas alterações podem não ser salvas");
      });
      
      // Limpar listener quando o componente for desmontado
      return () => unsubscribe();
    } catch (error) {
      console.error("Erro na referência do dashboard Firebase:", error);
      setIsLoading(false);
      toast.error("Erro de conexão com o banco de dados");
      
      // Em caso de erro grave, usar dados locais
      return () => {};
    }
  }, []);
  
  // Setup de presença de usuário e sincronização de dados
  useEffect(() => {
    const cleanupPresence = setupUserPresence();
    const cleanupSync = syncDashboardData();
    
    // Monitorar status online/offline da aplicação
    const handleOnline = () => {
      setIsConnected(true);
      toast.success("Conexão restabelecida");
      syncDashboardData(); // Re-sincronizar dados quando voltar online
    };
    
    const handleOffline = () => {
      setIsConnected(false);
      toast.warning("Sem conexão com internet - alterações serão salvas localmente");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      cleanupPresence && cleanupPresence();
      cleanupSync();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setupUserPresence, syncDashboardData]);
  
  // Monitorar notificações de alterações
  useEffect(() => {
    try {
      const lastUpdateRef = ref(database, 'lastUpdate');
      
      const unsubscribe = onValue(lastUpdateRef, (snapshot) => {
        try {
          if (snapshot.exists() && !isLoading) {
            const update = snapshot.val();
            
            // Mostrar notificação apenas se a atualização não foi feita pelo usuário atual
            if (update.userId !== currentUser?.uid && update.timestamp) {
              toast.info('Dashboard atualizado', {
                description: `Dados atualizados por ${update.userEmail || 'outro usuário'} em ${new Date(update.timestamp).toLocaleString('pt-BR')}`,
              });
            }
          }
        } catch (error) {
          console.error("Erro ao processar notificação de atualização:", error);
        }
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Erro na referência de atualização Firebase:", error);
    }
  }, [currentUser, isLoading]);

  const handleUpdateData = (updatedData: Partial<DashboardData>) => {
    if (isLoading) return;
    
    const newData = { ...data, ...updatedData };
    const processedData = updateAllIndicatorsStatus(newData);
    
    // Atualizar dados localmente primeiro (otimista)
    setData(processedData);
    
    try {
      // Implementar estratégia de atualização otimizada para múltiplos usuários
      const dashboardRef = ref(database, 'dashboard');
      
      // Atualizar apenas os campos modificados, não o objeto inteiro
      const updates: Record<string, any> = {};
      Object.keys(updatedData).forEach(key => {
        updates[key] = processedData[key as keyof DashboardData];
      });
      
      // Atualizar dados no Firebase
      update(ref(database, 'dashboard'), updates).then(() => {
        console.log("Dados parciais salvos com sucesso no Firebase");
        
        // Registrar quem fez a atualização
        if (currentUser) {
          update(ref(database, 'lastUpdate'), {
            userId: currentUser.uid,
            userEmail: currentUser.email,
            timestamp: new Date().toISOString(),
            fieldsUpdated: Object.keys(updatedData).join(', ')
          }).catch(err => {
            console.error("Erro ao definir informações de atualização:", err);
          });
        }
      }).catch(err => {
        console.error("Erro ao atualizar dados no Firebase:", err);
        toast.error("Erro ao salvar alterações");
      });
    } catch (error) {
      console.error("Erro de atualização Firebase:", error);
      toast.error("Erro de conexão ao salvar alterações");
    }
  };

  const handleExportToExcel = () => {
    exportToExcel(data);
  };

  // Mostrar indicador de status de conexão
  useEffect(() => {
    if (!isConnected) {
      toast.warning("Você está offline. As alterações serão sincronizadas quando voltar online.");
    }
  }, [isConnected]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-brand-neon border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-white font-medium">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SonnerToaster position="top-right" />
      <Toaster />
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          {!isConnected && (
            <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-md text-sm flex items-center">
              ⚠️ Modo offline - Alterações serão sincronizadas quando voltar online
            </div>
          )}
        </div>
        <Button 
          onClick={handleExportToExcel} 
          className="bg-brand-neon text-brand-black hover:bg-opacity-80 px-4 py-2 flex items-center gap-2"
        >
          <DownloadIcon size={18} />
          Baixar Dashboard em Excel
        </Button>
      </div>
      
      <HeaderSection data={data} onUpdateData={handleUpdateData} />
      <IndicatorsSection data={data} onUpdateData={handleUpdateData} />
      <RevenueGoalsSection data={data} onUpdateData={handleUpdateData} />
      <ChartsSection data={data} onUpdateData={handleUpdateData} />
      <LeadsTable data={data} onUpdateData={handleUpdateData} />
      <MeetingSummarySection data={data} onUpdateData={handleUpdateData} />
      <NotesAndRemarketing data={data} onUpdateData={handleUpdateData} />
      
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-title text-white mb-2">🧬 Identidade Visual</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li><span className="text-white">Fonte Títulos:</span> Qb One Heavy</li>
              <li><span className="text-white">Fonte Texto:</span> Montserrat</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-title text-white mb-2">Cores</h3>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-4 h-4 bg-[#00FF00] rounded-full"></div>
              <span className="text-white">Verde Neon: #00FF00</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-4 h-4 bg-[#070707] rounded-full border border-white"></div>
              <span className="text-white">Preto: #070707</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#FFFFFF] rounded-full"></div>
              <span className="text-white">Branco: #FFFFFF</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-title text-white mb-2">Estilo Geral</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>Fundo escuro</li>
              <li>Elementos minimalistas</li>
              <li>Destaques com neon verde</li>
              <li>Hierarquia clara de informações</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
