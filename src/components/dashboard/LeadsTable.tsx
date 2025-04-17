
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DashboardData } from "@/types/dashboard";
import { LeadsList } from "./leads/LeadsList";
import { AddLeadDialog } from "./leads/AddLeadDialog";
import { Lead } from "@/types/dashboard";

interface LeadsTableProps {
  data: DashboardData;
  onUpdateData: (updatedData: Partial<DashboardData>) => void;
}

export function LeadsTable({ data, onUpdateData }: LeadsTableProps) {
  // Ensure we have a valid array, even if data or qualifiedLeads is undefined
  const [leads, setLeads] = useState<Lead[]>(Array.isArray(data?.qualifiedLeads) ? data.qualifiedLeads : []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Function to add a new lead
  const handleAddLead = (newLead: Lead) => {    
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    onUpdateData({ qualifiedLeads: updatedLeads });
  };

  // Function to remove a lead
  const handleRemoveLead = (id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id);
    setLeads(updatedLeads);
    onUpdateData({ qualifiedLeads: updatedLeads });
  };

  return (
    <>
      <div className="bg-card p-6 rounded-lg shadow-md border border-border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-title text-white">
            📋 Tabela de Leads Qualificados
          </h2>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-brand-neon text-brand-black hover:bg-opacity-80"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Lead
          </Button>
        </div>
        
        <LeadsList leads={leads} onRemoveLead={handleRemoveLead} />
      </div>

      <AddLeadDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddLead={handleAddLead}
      />
    </>
  );
}
