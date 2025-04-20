
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import type { Contact } from "@/types/contacts";

const STORAGE_KEY = "contacts_data";

export const useContacts = () => {
  // Initialize state from localStorage or use empty array if nothing exists
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const savedContacts = localStorage.getItem(STORAGE_KEY);
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  // Sync to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

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
    // Check if contact with same title and phone already exists
    const isDuplicate = contacts.some(
      contact => contact.title === newContactData.title && contact.phone === newContactData.phone
    );
    
    if (isDuplicate) {
      toast.error("Um contato com este título e telefone já existe.");
      return;
    }
    
    const newContact: Contact = {
      ...newContactData,
      id: String(Date.now()),
      status: "não contatado"
    };
    
    setContacts([...contacts, newContact]);
    toast.success("Novo contato adicionado");
  };

  const handleEditContact = (id: string, updatedData: Omit<Contact, "id" | "status" | "lastContactDate">) => {
    // Check if another contact (not this one) has the same title and phone
    const isDuplicate = contacts.some(
      contact => contact.id !== id && 
                contact.title === updatedData.title && 
                contact.phone === updatedData.phone
    );
    
    if (isDuplicate) {
      toast.error("Um contato com este título e telefone já existe.");
      return;
    }
    
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

  const handleDeleteContact = (id: string) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    toast.success("Contato excluído com sucesso");
  };

  return {
    contacts,
    setContacts,
    handleStatusChange,
    handleAddContact,
    handleEditContact,
    handleDeleteContact
  };
};
