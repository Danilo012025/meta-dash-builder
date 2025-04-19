
import { Link } from "react-router-dom";
import { useState } from "react";
import { ContactsList } from "@/components/contacts/ContactsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
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
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="clinicas">Clínicas</TabsTrigger>
            <TabsTrigger value="oticas">Óticas</TabsTrigger>
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
