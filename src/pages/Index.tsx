
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-end mb-4">
          <Link to="/contacts">
            <Button 
              className="bg-brand-neon text-brand-black hover:bg-opacity-80 px-4 py-2 flex items-center gap-2"
            >
              <Phone size={18} />
              Gerenciar Contatos
            </Button>
          </Link>
        </div>
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
