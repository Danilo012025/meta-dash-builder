
export interface Contact {
  id: string;
  categoryName: string;
  title: string;
  city: string;
  phone: string;
  url: string;
  instagram: string;
  leads: string;
  status: "não contatado" | "atendeu" | "não atendeu" | "ligar novamente" | "outro horário" | "lead ruim";
  notes?: string;
  lastContactDate?: string;
}
