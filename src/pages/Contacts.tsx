
import { ContactsList } from "@/components/contacts/ContactsList";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-title text-white mb-8">Gerenciamento de Contatos</h1>
        <ContactsList />
      </div>
    </div>
  );
};

export default Contacts;
