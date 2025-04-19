
import { Phone, Instagram, MapPin, Globe, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ContactStatusButtons } from "./ContactStatusButtons";
import { getStatusColor } from "@/utils/contactStatus";
import type { Contact } from "@/types/contacts";

interface ContactsTableProps {
  contacts: Contact[];
  onStatusChange: (id: string, status: Contact["status"]) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
}

export function ContactsTable({ contacts, onStatusChange, onEditContact, onDeleteContact }: ContactsTableProps) {
  return (
    <div className="overflow-x-auto rounded-b-lg">
      <Table>
        <TableHeader className="bg-secondary/70">
          <TableRow>
            <TableHead className="text-white">Categoria</TableHead>
            <TableHead className="text-white">Título</TableHead>
            <TableHead className="text-white">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Cidade</span>
              </div>
            </TableHead>
            <TableHead className="text-white">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>Telefone</span>
              </div>
            </TableHead>
            <TableHead className="text-white">
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>URL</span>
              </div>
            </TableHead>
            <TableHead className="text-white">
              <div className="flex items-center gap-1">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </div>
            </TableHead>
            <TableHead className="text-white">Leads</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Último Contato</TableHead>
            <TableHead className="text-white">Notas</TableHead>
            <TableHead className="text-white text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-white py-8">
                Nenhum contato encontrado.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id} className="border-t border-border hover:bg-secondary/50">
                <TableCell className="font-medium text-white">{contact.categoryName}</TableCell>
                <TableCell className="text-white">{contact.title}</TableCell>
                <TableCell className="text-white">{contact.city}</TableCell>
                <TableCell className="text-white">{contact.phone}</TableCell>
                <TableCell className="text-white">
                  {contact.url && (
                    <a href={contact.url} target="_blank" rel="noopener noreferrer" className="text-brand-neon hover:underline">
                      Link
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-white">{contact.instagram}</TableCell>
                <TableCell className="text-white">{contact.leads}</TableCell>
                <TableCell className={getStatusColor(contact.status)}>
                  {contact.status}
                </TableCell>
                <TableCell className="text-white">{contact.lastContactDate || "—"}</TableCell>
                <TableCell className="text-white">{contact.notes || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditContact(contact)}
                      className="hover:text-brand-neon"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteContact(contact.id)}
                      className="hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ContactStatusButtons 
                      contactId={contact.id}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
