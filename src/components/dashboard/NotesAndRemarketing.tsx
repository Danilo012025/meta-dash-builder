
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { DashboardData, RemarketingLead } from "@/types/dashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NotesAndRemarketingProps {
  data: DashboardData;
  onUpdateData: (updatedData: Partial<DashboardData>) => void;
}

export function NotesAndRemarketing({ data, onUpdateData }: NotesAndRemarketingProps) {
  const [strategicNotes, setStrategicNotes] = useState(data.strategicNotes);
  const [remarketingLeads, setRemarketingLeads] = useState<RemarketingLead[]>(data.remarketingLeads);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRemarketingLead, setNewRemarketingLead] = useState<RemarketingLead>({
    name: "",
    source: "Instagram",
    lossReason: "",
    nextAction: "",
    nextContactDate: new Date().toLocaleDateString('pt-BR')
  });

  const handleNotesChange = (value: string) => {
    setStrategicNotes(value);
    onUpdateData({ strategicNotes: value });
  };

  const handleAddRemarketingLead = () => {
    if (!newRemarketingLead.name || !newRemarketingLead.lossReason) return;
    
    const updatedLeads = [...remarketingLeads, { ...newRemarketingLead }];
    setRemarketingLeads(updatedLeads);
    onUpdateData({ remarketingLeads: updatedLeads });
    
    setNewRemarketingLead({
      name: "",
      source: "Instagram",
      lossReason: "",
      nextAction: "",
      nextContactDate: new Date().toLocaleDateString('pt-BR')
    });
    setIsAddDialogOpen(false);
  };

  const handleRemoveRemarketingLead = (index: number) => {
    const updatedLeads = [...remarketingLeads];
    updatedLeads.splice(index, 1);
    setRemarketingLeads(updatedLeads);
    onUpdateData({ remarketingLeads: updatedLeads });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Observações Estratégicas */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h2 className="text-2xl font-title text-white mb-4">
            🧠 Observações Estratégicas do Mês
          </h2>
          
          <div className="space-y-2">
            <label className="block text-sm text-muted-foreground mb-1">
              (Campo livre para análise, aprendizados e pontos de atenção)
            </label>
            <Textarea 
              value={strategicNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="bg-secondary text-white min-h-[200px]"
              placeholder="Ex: 'Semana 2 teve menor comparecimento, revisar abordagem e horário das reuniões.'"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Remarketing e Reabordagem */}
      <div>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-title text-white">
                🔄 Remarketing e Reabordagem
              </h2>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-brand-neon text-brand-black hover:bg-opacity-80"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
            
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead className="text-white">Nome</TableHead>
                    <TableHead className="text-white">Origem</TableHead>
                    <TableHead className="text-white">Motivo da Perda</TableHead>
                    <TableHead className="text-white">Data</TableHead>
                    <TableHead className="text-white text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remarketingLeads.length > 0 ? (
                    remarketingLeads.map((lead, index) => (
                      <TableRow key={index} className="border-t border-border hover:bg-secondary/50">
                        <TableCell className="font-medium text-white">{lead.name}</TableCell>
                        <TableCell className="text-white">{lead.source}</TableCell>
                        <TableCell className="text-white">{lead.lossReason}</TableCell>
                        <TableCell className="text-white">{lead.nextContactDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRemarketingLead(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Nenhum lead de remarketing encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Diálogo para adicionar lead de remarketing */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-card text-white border-border">
            <DialogHeader>
              <DialogTitle className="text-white">Adicionar Lead para Remarketing</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Nome
                </label>
                <Input
                  id="name"
                  value={newRemarketingLead.name}
                  onChange={(e) => setNewRemarketingLead({ ...newRemarketingLead, name: e.target.value })}
                  className="bg-secondary text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lossReason" className="text-sm font-medium text-muted-foreground">
                  Motivo da Perda
                </label>
                <Input
                  id="lossReason"
                  value={newRemarketingLead.lossReason}
                  onChange={(e) => setNewRemarketingLead({ ...newRemarketingLead, lossReason: e.target.value })}
                  className="bg-secondary text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nextAction" className="text-sm font-medium text-muted-foreground">
                  Próxima Ação
                </label>
                <Input
                  id="nextAction"
                  value={newRemarketingLead.nextAction}
                  onChange={(e) => setNewRemarketingLead({ ...newRemarketingLead, nextAction: e.target.value })}
                  className="bg-secondary text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nextContactDate" className="text-sm font-medium text-muted-foreground">
                  Data para Reabordar
                </label>
                <Input
                  id="nextContactDate"
                  value={newRemarketingLead.nextContactDate}
                  onChange={(e) => setNewRemarketingLead({ ...newRemarketingLead, nextContactDate: e.target.value })}
                  className="bg-secondary text-white"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
                Cancelar
              </Button>
              <Button 
                onClick={handleAddRemarketingLead} 
                className="bg-brand-neon text-brand-black hover:bg-opacity-80"
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
