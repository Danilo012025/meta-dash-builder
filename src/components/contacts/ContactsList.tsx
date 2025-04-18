
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddContactForm } from "./AddContactForm";
import { ImportContacts } from "./ImportContacts";
import { ContactsHeader } from "./ContactsHeader";
import { ContactsTable } from "./ContactsTable";
import { useContacts } from "@/hooks/useContacts";
import type { Contact } from "@/types/contacts";

export function ContactsList() {
  const { contacts, handleStatusChange, handleAddContact, handleEditContact, setContacts } = useContacts();
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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
          contacts={contacts}
          onStatusChange={handleStatusChange}
          onEditContact={handleEditContactClick}
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
          setContacts(prevContacts => [...prevContacts, ...newContacts]);
        }}
      />
    </Card>
  );
}
