
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
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

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

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
    toast.success("Novo contato adicionado");
  };

  return {
    contacts,
    setContacts,
    handleStatusChange,
    handleAddContact
  };
};
