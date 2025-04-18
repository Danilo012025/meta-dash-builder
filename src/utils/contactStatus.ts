
import type { Contact } from "@/types/contacts";

export const getStatusColor = (status: Contact["status"]) => {
  switch (status) {
    case "atendeu":
      return "text-green-500";
    case "não atendeu":
      return "text-red-500";
    case "ligar novamente":
      return "text-blue-500";
    case "outro horário":
      return "text-yellow-500";
    case "lead ruim":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
