
import { Button } from "@/components/ui/button";
import { Phone, FileSpreadsheet, Plus } from "lucide-react";
import type { Contact } from "@/types/contacts";

interface ContactsHeaderProps {
  onOpenAddDialog: () => void;
  onOpenImportDialog: () => void;
}

export function ContactsHeader({ onOpenAddDialog, onOpenImportDialog }: ContactsHeaderProps) {
  return (
    <div className="bg-secondary p-4 rounded-t-lg flex justify-between items-center">
      <h2 className="text-xl font-title text-white flex items-center gap-2">
        <Phone className="h-5 w-5 text-brand-neon" />
        Lista de Contatos
      </h2>
      <div className="flex gap-2">
        <Button 
          onClick={onOpenImportDialog}
          variant="outline"
          className="bg-secondary-foreground/10 text-white hover:bg-secondary-foreground/20"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Importar Contatos
        </Button>
        <Button 
          onClick={onOpenAddDialog}
          className="bg-brand-neon text-brand-black hover:bg-opacity-80"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Contato
        </Button>
      </div>
    </div>
  );
}
