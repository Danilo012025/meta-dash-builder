import { useState, useEffect } from "react";
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
import { ref, onValue, set } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";

export function Dashboard() {
  const [data, setData] = useState<DashboardData>(updateAllIndicatorsStatus(initialDashboardData));
  const { currentUser } = useAuth();
  
  // Listen for changes in Firebase
  useEffect(() => {
    try {
      // Reference to the dashboard data in Firebase
      const dashboardRef = ref(database, 'dashboard');
      
      // First check if there's data in Firebase
      const unsubscribe = onValue(dashboardRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            // If data exists, use it
            const firebaseData = snapshot.val();
            setData(updateAllIndicatorsStatus(firebaseData));
          } else {
            // Otherwise, initialize with default data
            set(dashboardRef, initialDashboardData).catch(err => {
              console.error("Error setting initial data:", err);
            });
          }
        } catch (error) {
          console.error("Error processing Firebase data:", error);
          // Fallback to local data if Firebase fails
          setData(updateAllIndicatorsStatus(initialDashboardData));
        }
      }, {
        onlyOnce: false // Set to false to continue listening for updates
      });
      
      // Clean up the listener when component unmounts
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Firebase dashboard reference error:", error);
      // Use local data if Firebase is not available
      setData(updateAllIndicatorsStatus(initialDashboardData));
    }
  }, []);
  
  // Handle change notifications
  useEffect(() => {
    try {
      const lastUpdateRef = ref(database, 'lastUpdate');
      
      const unsubscribe = onValue(lastUpdateRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const update = snapshot.val();
            
            // Only show notification if the update wasn't made by current user
            if (update.userId !== currentUser?.uid) {
              toast.info('Dashboard atualizado', {
                description: `Dados atualizados por ${update.userEmail || 'outro usuário'}.`
              });
            }
          }
        } catch (error) {
          console.error("Error processing update notification:", error);
        }
      });
      
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Firebase update reference error:", error);
    }
  }, [currentUser]);

  const handleUpdateData = (updatedData: Partial<DashboardData>) => {
    const newData = { ...data, ...updatedData };
    const processedData = updateAllIndicatorsStatus(newData);
    
    // Update data locally
    setData(processedData);
    
    try {
      // Reference to the dashboard data in Firebase
      const dashboardRef = ref(database, 'dashboard');
      
      // Update data in Firebase
      set(dashboardRef, processedData).catch(err => {
        console.error("Error updating data in Firebase:", err);
      });
      
      // Record who made the update
      if (currentUser) {
        set(ref(database, 'lastUpdate'), {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          timestamp: new Date().toISOString()
        }).catch(err => {
          console.error("Error setting update info:", err);
        });
      }
    } catch (error) {
      console.error("Firebase update error:", error);
    }
  };

  const handleExportToExcel = () => {
    exportToExcel(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SonnerToaster position="top-right" />
      <Toaster />
      
      <div className="mb-6 flex justify-end">
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
