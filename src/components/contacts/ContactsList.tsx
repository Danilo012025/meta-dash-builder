
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddContactForm } from "./AddContactForm";
import { ImportContacts } from "./ImportContacts";
import { ContactsHeader } from "./ContactsHeader";
import { ContactsTable } from "./ContactsTable";
import { useContacts } from "@/hooks/useContacts";

export function ContactsList() {
  const { contacts, handleStatusChange, handleAddContact, setContacts } = useContacts();
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
        />
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
        }}
      />
    </Card>
  );
}
