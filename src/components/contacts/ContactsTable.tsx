
import { Phone, Instagram, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContactStatusButtons } from "./ContactStatusButtons";
import { getStatusColor } from "@/utils/contactStatus";
import type { Contact } from "@/types/contacts";

interface ContactsTableProps {
  contacts: Contact[];
  onStatusChange: (id: string, status: Contact["status"]) => void;
}

export function ContactsTable({ contacts, onStatusChange }: ContactsTableProps) {
  return (
    <div className="overflow-x-auto rounded-b-lg">
      <Table>
        <TableHeader className="bg-secondary/70">
          <TableRow>
            <TableHead className="text-white">Nome</TableHead>
            <TableHead className="text-white">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>Telefone</span>
              </div>
            </TableHead>
            <TableHead className="text-white">
              <div className="flex items-center gap-1">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </div>
            </TableHead>
            <TableHead className="text-white">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Endereço</span>
              </div>
            </TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Último Contato</TableHead>
            <TableHead className="text-white">Notas</TableHead>
            <TableHead className="text-white text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="border-t border-border hover:bg-secondary/50">
              <TableCell className="font-medium text-white">{contact.name}</TableCell>
              <TableCell className="text-white">{contact.phone}</TableCell>
              <TableCell className="text-white">{contact.instagram}</TableCell>
              <TableCell className="text-white">{contact.address}</TableCell>
              <TableCell className={getStatusColor(contact.status)}>
                {contact.status}
              </TableCell>
              <TableCell className="text-white">{contact.lastContactDate || "—"}</TableCell>
              <TableCell className="text-white">{contact.notes || "—"}</TableCell>
              <TableCell>
                <ContactStatusButtons 
                  contactId={contact.id}
                  onStatusChange={onStatusChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
