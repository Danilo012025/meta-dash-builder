
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddContactForm } from "./AddContactForm";
import { ImportContacts } from "./ImportContacts";
import { ContactsHeader } from "./ContactsHeader";
import { ContactsTable } from "./ContactsTable";
import { useContacts } from "@/hooks/useContacts";
import { toast } from "@/components/ui/sonner"; // Add this import
import type { Contact } from "@/types/contacts";

interface ContactsListProps {
  categoryFilter: string | null;
}

export function ContactsList({ categoryFilter }: ContactsListProps) {
  const { contacts, handleStatusChange, handleAddContact, handleEditContact, handleDeleteContact, setContacts } = useContacts();
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Filter contacts based on category if a filter is provided
  const filteredContacts = categoryFilter 
    ? contacts.filter(contact => 
        contact.categoryName.toLowerCase().includes(categoryFilter.toLowerCase()))
    : contacts;

  const handleEditContactClick = (contact: Contact) => {
    setEditingContact(contact);
    setIsAddContactDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddContactDialogOpen(false);
    setEditingContact(null);
  };

  return (
    <Card className="border-border bg-background shadow-sm">
      <ContactsHeader 
        onOpenAddDialog={() => setIsAddContactDialogOpen(true)}
        onOpenImportDialog={() => setIsImportDialogOpen(true)}
      />
      <CardContent className="p-0">
        <ContactsTable 
          contacts={filteredContacts}
          onStatusChange={handleStatusChange}
          onEditContact={handleEditContactClick}
          onDeleteContact={handleDeleteContact}
        />
      </CardContent>
      
      <Dialog open={isAddContactDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Editar Contato' : 'Adicionar Novo Contato'}
            </DialogTitle>
          </DialogHeader>
          <AddContactForm 
            onSubmit={(contactData) => {
              if (editingContact) {
                handleEditContact(editingContact.id, contactData);
              } else {
                handleAddContact(contactData);
              }
              handleCloseDialog();
            }}
            onCancel={handleCloseDialog}
            initialData={editingContact || undefined}
            isEditing={!!editingContact}
          />
        </DialogContent>
      </Dialog>

      <ImportContacts
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={(newContacts) => {
          // Check for duplicates before adding
          const existingMap = new Map(contacts.map(contact => [
            `${contact.title}-${contact.phone}`, contact
          ]));
          
          const uniqueContacts = newContacts.filter(newContact => {
            const key = `${newContact.title}-${newContact.phone}`;
            return !existingMap.has(key);
          });
          
          if (uniqueContacts.length < newContacts.length) {
            toast.info(`${newContacts.length - uniqueContacts.length} contatos duplicados foram ignorados.`);
          }
          
          setContacts(prevContacts => [...prevContacts, ...uniqueContacts]);
        }}
      />
    </Card>
  );
}
