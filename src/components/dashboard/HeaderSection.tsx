
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DashboardData } from "@/types/dashboard";

interface HeaderSectionProps {
  data: DashboardData;
  onUpdateData: (updatedData: Partial<DashboardData>) => void;
}

export function HeaderSection({ data, onUpdateData }: HeaderSectionProps) {
  const [referenceMonth, setReferenceMonth] = useState(data.referenceMonth);
  const [responsiblePerson, setResponsiblePerson] = useState(data.responsiblePerson);

  const handleSave = () => {
    onUpdateData({
      referenceMonth,
      responsiblePerson
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border mb-6">
      <h1 className="text-3xl font-title text-brand-neon mb-4">
        Dashboard Mensal de Gestão de Clientes – CRM
      </h1>
      <h2 className="text-xl text-white mb-6">The Start Agência</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="month" className="block text-sm font-medium text-muted-foreground">
            🗓 Mês de Referência
          </label>
          <Input 
            id="month"
            value={referenceMonth}
            onChange={(e) => setReferenceMonth(e.target.value)}
            className="bg-secondary text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="responsible" className="block text-sm font-medium text-muted-foreground">
            📁 Responsável pela Atualização
          </label>
          <Input 
            id="responsible"
            value={responsiblePerson}
            onChange={(e) => setResponsiblePerson(e.target.value)}
            className="bg-secondary text-white"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-brand-neon text-brand-black hover:bg-opacity-80">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
