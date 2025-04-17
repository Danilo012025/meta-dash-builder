
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/dashboard";

interface AddLeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

export function AddLeadDialog({ isOpen, onClose, onAddLead }: AddLeadDialogProps) {
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
    
    onAddLead(leadToAdd);
    
    // Reset the form and close the dialog
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button onClick={onClose} variant="outline">
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
  );
}
