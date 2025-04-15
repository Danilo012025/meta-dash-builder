
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardData, Indicator } from "@/types/dashboard";
import { calculateIndicatorStatus } from "@/data/dashboardData";

interface IndicatorsSectionProps {
  data: DashboardData;
  onUpdateData: (updatedData: Partial<DashboardData>) => void;
}

export function IndicatorsSection({ data, onUpdateData }: IndicatorsSectionProps) {
  const [indicators, setIndicators] = useState<Indicator[]>(data.indicators);

  // Atualizar indicadores sempre que os dados mudarem
  useEffect(() => {
    setIndicators(data.indicators);
  }, [data.indicators]);

  // Função para atualizar um indicador específico
  const handleValueChange = (index: number, value: number) => {
    const updatedIndicators = [...indicators];
    updatedIndicators[index] = {
      ...updatedIndicators[index],
      value,
      status: calculateIndicatorStatus(value, updatedIndicators[index].goal)
    };
    
    setIndicators(updatedIndicators);
    onUpdateData({ indicators: updatedIndicators });
  };

  // Função para atualizar a meta de um indicador
  const handleGoalChange = (index: number, goal: number) => {
    const updatedIndicators = [...indicators];
    updatedIndicators[index] = {
      ...updatedIndicators[index],
      goal,
      status: calculateIndicatorStatus(updatedIndicators[index].value, goal)
    };
    
    setIndicators(updatedIndicators);
    onUpdateData({ indicators: updatedIndicators });
  };

  // Função para renderizar o status com o emoji correto
  const renderStatus = (status: "success" | "warning" | "error" | null) => {
    switch (status) {
      case "success":
        return <span className="text-brand-neon">✅ Meta Atingida</span>;
      case "warning":
        return <span className="text-yellow-400">⚠️ Em Andamento</span>;
      case "error":
        return <span className="text-red-500">❌ Meta Não Atingida</span>;
      default:
        return <span className="text-muted-foreground">Status</span>;
    }
  };

  return (
    <Card className="bg-card border-border mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-title text-white mb-4">
          🎯 Indicadores Gerais do Mês
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-secondary rounded-lg p-4 border border-border">
              <h3 className="text-lg font-semibold mb-3 text-white">
                {indicator.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Valor Atual
                  </label>
                  <Input 
                    type="number"
                    value={indicator.value}
                    onChange={(e) => handleValueChange(index, Number(e.target.value))}
                    className="bg-muted text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Meta
                  </label>
                  <Input 
                    type="number"
                    value={indicator.goal}
                    onChange={(e) => handleGoalChange(index, Number(e.target.value))}
                    className="bg-muted text-white"
                  />
                </div>
              </div>
              
              <div className="mt-3 text-right">
                {renderStatus(indicator.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
