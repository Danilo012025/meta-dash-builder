
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Lead } from "@/types/dashboard";

interface LeadsListProps {
  leads: Lead[];
  onRemoveLead: (id: string) => void;
}

export function LeadsList({ leads, onRemoveLead }: LeadsListProps) {
  return (
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
                    onClick={() => onRemoveLead(lead.id)}
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
  );
}
