
export interface Contact {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  address: string;
  status: "não contatado" | "atendeu" | "não atendeu" | "ligar novamente" | "outro horário" | "lead ruim";
  notes?: string;
  lastContactDate?: string;
}
