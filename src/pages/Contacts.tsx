
import { Link } from "react-router-dom";
import { ContactsList } from "@/components/contacts/ContactsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center mb-8 gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-title text-white">Gerenciamento de Contatos</h1>
        </div>
        <ContactsList />
      </div>
    </div>
  );
};

export default Contacts;
