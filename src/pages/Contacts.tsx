
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ContactsList } from "@/components/contacts/ContactsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { contacts } = useContacts();
  
  // Calculate counts with useMemo to optimize performance
  const { totalContacts, clinicContacts, opticsContacts } = useMemo(() => {
    return {
      totalContacts: contacts.length,
      clinicContacts: contacts.filter(contact => contact.categoryName === "Clínica").length,
      opticsContacts: contacts.filter(contact => contact.categoryName === "Ótica").length
    };
  }, [contacts]);
  
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

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all" className="relative">
              Todos
              <span className="absolute -top-1 -right-1 bg-brand-neon text-brand-black text-xs px-1.5 py-0.5 rounded-full">
                {totalContacts}
              </span>
            </TabsTrigger>
            <TabsTrigger value="clinicas" className="relative">
              Clínicas
              <span className="absolute -top-1 -right-1 bg-brand-neon text-brand-black text-xs px-1.5 py-0.5 rounded-full">
                {clinicContacts}
              </span>
            </TabsTrigger>
            <TabsTrigger value="oticas" className="relative">
              Óticas
              <span className="absolute -top-1 -right-1 bg-brand-neon text-brand-black text-xs px-1.5 py-0.5 rounded-full">
                {opticsContacts}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ContactsList categoryFilter={null} />
          </TabsContent>
          
          <TabsContent value="clinicas">
            <ContactsList categoryFilter="Clínica" />
          </TabsContent>
          
          <TabsContent value="oticas">
            <ContactsList categoryFilter="Ótica" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Contacts;
