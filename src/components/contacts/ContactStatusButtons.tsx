
import { Button } from "@/components/ui/button";
import { Check, X, PhoneCall, Clock, Trash2 } from "lucide-react";
import type { Contact } from "@/types/contacts";

interface ContactStatusButtonsProps {
  contactId: string;
  onStatusChange: (id: string, status: Contact["status"]) => void;
}

export function ContactStatusButtons({ contactId, onStatusChange }: ContactStatusButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onStatusChange(contactId, "atendeu")}
        title="Atendeu"
        className="text-green-500 hover:text-green-700 hover:bg-green-500/10"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onStatusChange(contactId, "não atendeu")}
        title="Não Atendeu"
        className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onStatusChange(contactId, "ligar novamente")}
        title="Ligar Novamente"
        className="text-blue-500 hover:text-blue-700 hover:bg-blue-500/10"
      >
        <PhoneCall className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onStatusChange(contactId, "outro horário")}
        title="Outro Horário"
        className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-500/10"
      >
        <Clock className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onStatusChange(contactId, "lead ruim")}
        title="Lead Ruim"
        className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
