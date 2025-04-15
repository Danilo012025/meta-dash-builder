
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

// Create a unique user ID for the current session
const currentUserId = Math.random().toString(36).substring(2, 9);

// Create a BroadcastChannel for sharing data between browser tabs/windows
const broadcastChannel = new BroadcastChannel('dashboard-sync');

export function Dashboard() {
  const [data, setData] = useState<DashboardData>(updateAllIndicatorsStatus(initialDashboardData));

  // Listen for changes from other browser tabs/windows
  useEffect(() => {
    const handleMessageReceived = (event: MessageEvent) => {
      if (event.data.userId !== currentUserId) {
        setData(updateAllIndicatorsStatus(event.data.dashboardData));
        toast.info('Dashboard atualizado', {
          description: 'Os dados foram atualizados por outro usuário.'
        });
      }
    };

    broadcastChannel.addEventListener('message', handleMessageReceived);

    // Clean up event listener when component unmounts
    return () => {
      broadcastChannel.removeEventListener('message', handleMessageReceived);
    };
  }, []);

  const handleUpdateData = (updatedData: Partial<DashboardData>) => {
    setData(prevData => {
      const newData = { ...prevData, ...updatedData };
      const processedData = updateAllIndicatorsStatus(newData);
      
      // Broadcast the updated data to other tabs/windows
      broadcastChannel.postMessage({
        userId: currentUserId,
        dashboardData: processedData
      });
      
      return processedData;
    });
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
