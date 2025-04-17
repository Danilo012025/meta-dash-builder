
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DashboardData, Lead } from "@/types/dashboard";
import { PlusIcon, Trash2Icon } from "lucide-react";

interface LeadsTableProps {
  data: DashboardData;
  onUpdateData: (updatedData: Partial<DashboardData>) => void;
}

export function LeadsTable({ data, onUpdateData }: LeadsTableProps) {
  // Add a null check to ensure data.qualifiedLeads exists before using it
  const [leads, setLeads] = useState<Lead[]>(data?.qualifiedLeads || []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: "",
    company: "",
    instagram: "",
    phone: "",
    source: "Instagram",
    status: "Ativo",
    lastContact: new Date().toLocaleDateString('pt-BR'),
    responsible: "Danilo"
  });

  // Função para adicionar um novo lead
  const handleAddLead = () => {
    if (!newLead.name || !newLead.company) return;
    
    const leadToAdd: Lead = {
      id: Date.now().toString(),
      name: newLead.name || "",
      company: newLead.company || "",
      instagram: newLead.instagram || "",
      phone: newLead.phone || "",
      source: newLead.source || "Instagram",
      status: newLead.status || "Ativo",
      lastContact: newLead.lastContact || new Date().toLocaleDateString('pt-BR'),
      responsible: newLead.responsible || "Danilo"
    };
    
    const updatedLeads = [...leads, leadToAdd];
    setLeads(updatedLeads);
    onUpdateData({ qualifiedLeads: updatedLeads });
    
    // Resetar o formulário e fechar o diálogo
    setNewLead({
      name: "",
      company: "",
      instagram: "",
      phone: "",
      source: "Instagram",
      status: "Ativo",
      lastContact: new Date().toLocaleDateString('pt-BR'),
      responsible: "Danilo"
    });
    setIsAddDialogOpen(false);
  };

  // Função para remover um lead
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
        
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Empresa</TableHead>
                <TableHead className="text-white">Instagram</TableHead>
                <TableHead className="text-white">Telefone</TableHead>
                <TableHead className="text-white">Origem</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Último Contato</TableHead>
                <TableHead className="text-white">Responsável</TableHead>
                <TableHead className="text-white text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="border-t border-border hover:bg-secondary/50">
                    <TableCell className="font-medium text-white">{lead.name}</TableCell>
                    <TableCell className="text-white">{lead.company}</TableCell>
                    <TableCell className="text-white">{lead.instagram}</TableCell>
                    <TableCell className="text-white">{lead.phone}</TableCell>
                    <TableCell className="text-white">{lead.source}</TableCell>
                    <TableCell className="text-white">{lead.status}</TableCell>
                    <TableCell className="text-white">{lead.lastContact}</TableCell>
                    <TableCell className="text-white">{lead.responsible}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLead(lead.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    Nenhum lead encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo para adicionar um novo lead */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card text-white border-border">
          <DialogHeader>
            <DialogTitle className="text-white">Adicionar Novo Lead</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                Nome
              </label>
              <Input
                id="name"
                value={newLead.name || ""}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                className="bg-secondary text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium text-muted-foreground">
                Empresa
              </label>
              <Input
                id="company"
                value={newLead.company || ""}
                onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                className="bg-secondary text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="instagram" className="text-sm font-medium text-muted-foreground">
                Instagram
              </label>
              <Input
                id="instagram"
                value={newLead.instagram || ""}
                onChange={(e) => setNewLead({ ...newLead, instagram: e.target.value })}
                className="bg-secondary text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                Telefone
              </label>
              <Input
                id="phone"
                value={newLead.phone || ""}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                className="bg-secondary text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button 
              onClick={handleAddLead} 
              className="bg-brand-neon text-brand-black hover:bg-opacity-80"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
