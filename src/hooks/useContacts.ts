
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import type { Contact } from "@/types/contacts";

const initialContacts: Contact[] = [];

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
      id: String(Date.now()),
      status: "não contatado"
    };
    
    setContacts([...contacts, newContact]);
    toast.success("Novo contato adicionado");
  };

  const handleEditContact = (id: string, updatedData: Omit<Contact, "id" | "status" | "lastContactDate">) => {
    setContacts(prevContacts => prevContacts.map(contact => {
      if (contact.id === id) {
        return {
          ...contact,
          ...updatedData,
        };
      }
      return contact;
    }));
    
    toast.success("Contato atualizado com sucesso");
  };

  return {
    contacts,
    setContacts,
    handleStatusChange,
    handleAddContact,
    handleEditContact
  };
};
