import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, MapPin, Check, X, PhoneCall, Clock, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Contact {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  address: string;
  status: "não contatado" | "atendeu" | "não atendeu" | "ligar novamente" | "outro horário" | "lead ruim";
  notes?: string;
  lastContactDate?: string;
}

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

  const handleAddContact = () => {
    const newContact: Contact = {
      id: String(contacts.length + 1),
      name: "Novo Contato",
      phone: "",
      instagram: "",
      address: "",
      status: "não contatado"
    };
    
    setContacts([...contacts, newContact]);
    toast.success("Novo contato adicionado");
  };

  return (
    <Card className="border-border bg-background shadow-sm">
      <CardHeader className="bg-secondary p-4 rounded-t-lg flex justify-between items-center">
        <CardTitle className="text-xl font-title text-white flex items-center gap-2">
          <Phone className="h-5 w-5 text-brand-neon" />
          Lista de Contatos
        </CardTitle>
        <Button 
          onClick={() => setIsAddContactDialogOpen(true)}
          className="bg-brand-neon text-brand-black hover:bg-opacity-80"
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
        </Button>
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
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(contact.id, "atendeu")}
                        title="Atendeu"
                        className="text-green-500 hover:text-green-700 hover:bg-green-500/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(contact.id, "não atendeu")}
                        title="Não Atendeu"
                        className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(contact.id, "ligar novamente")}
                        title="Ligar Novamente"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-500/10"
                      >
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(contact.id, "outro horário")}
                        title="Outro Horário"
                        className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-500/10"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(contact.id, "lead ruim")}
                        title="Lead Ruim"
                        className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
          <div className="grid gap-4 py-4">
            <Button onClick={handleAddContact} className="w-full">
              Confirmar Adição de Contato
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
