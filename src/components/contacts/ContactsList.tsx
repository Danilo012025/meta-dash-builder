import { useState } from "react";
import { Phone, Instagram, MapPin, Plus, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { ImportContacts } from "./ImportContacts";
import { AddContactForm } from "./AddContactForm";
import { ContactStatusButtons } from "./ContactStatusButtons";
import type { Contact } from "@/types/contacts";

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Maria Silva",
    phone: "(11) 98765-4321",
    instagram: "@mariasilva",
    address: "Av. Paulista, 1000, São Paulo - SP",
    status: "não contatado"
  },
  {
    id: "2",
    name: "João Santos",
    phone: "(11) 97654-3210",
    instagram: "@joaosantos",
    address: "Rua Augusta, 500, São Paulo - SP",
    status: "atendeu",
    lastContactDate: "15/04/2025"
  },
  {
    id: "3",
    name: "Ana Costa",
    phone: "(11) 96543-2109",
    instagram: "@anacosta",
    address: "Rua Oscar Freire, 300, São Paulo - SP",
    status: "não atendeu",
    lastContactDate: "14/04/2025"
  },
  {
    id: "4",
    name: "Carlos Mendes",
    phone: "(11) 95432-1098",
    instagram: "@carlosmendes",
    address: "Av. Brigadeiro Faria Lima, 2000, São Paulo - SP",
    status: "ligar novamente",
    lastContactDate: "13/04/2025",
    notes: "Ligar na segunda-feira"
  },
  {
    id: "5",
    name: "Fernanda Lima",
    phone: "(11) 94321-0987",
    instagram: "@fernandalima",
    address: "Rua dos Pinheiros, 100, São Paulo - SP",
    status: "outro horário",
    lastContactDate: "12/04/2025",
    notes: "Prefere ser contatada após as 18h"
  }
];

export function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const handleStatusChange = (id: string, newStatus: Contact["status"]) => {
    setContacts(prevContacts => prevContacts.map(contact => {
      if (contact.id === id) {
        return {
          ...contact,
          status: newStatus,
          lastContactDate: new Date().toLocaleDateString('pt-BR')
        };
      }
      return contact;
    }));
    
    toast.success(`Status atualizado para: ${newStatus}`);
  };

  const handleAddContact = (newContactData: Omit<Contact, "id" | "status" | "lastContactDate">) => {
    const newContact: Contact = {
      ...newContactData,
      id: String(contacts.length + 1),
      status: "não contatado"
    };
    
    setContacts([...contacts, newContact]);
    setIsAddContactDialogOpen(false);
    toast.success("Novo contato adicionado");
  };

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "atendeu":
        return "text-green-500";
      case "não atendeu":
        return "text-red-500";
      case "ligar novamente":
        return "text-blue-500";
      case "outro horário":
        return "text-yellow-500";
      case "lead ruim":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="border-border bg-background shadow-sm">
      <CardHeader className="bg-secondary p-4 rounded-t-lg flex justify-between items-center">
        <CardTitle className="text-xl font-title text-white flex items-center gap-2">
          <Phone className="h-5 w-5 text-brand-neon" />
          Lista de Contatos
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsImportDialogOpen(true)}
            variant="outline"
            className="bg-secondary-foreground/10 text-white hover:bg-secondary-foreground/20"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importar Contatos
          </Button>
          <Button 
            onClick={() => setIsAddContactDialogOpen(true)}
            className="bg-brand-neon text-brand-black hover:bg-opacity-80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Contato
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
                      onStatusChange={handleStatusChange}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Contato</DialogTitle>
          </DialogHeader>
          <AddContactForm 
            onSubmit={handleAddContact}
            onCancel={() => setIsAddContactDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ImportContacts
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={(newContacts) => {
          setContacts(prevContacts => [...prevContacts, ...newContacts]);
          toast.success(`${newContacts.length} contatos importados com sucesso!`);
        }}
      />
    </Card>
  );
}
