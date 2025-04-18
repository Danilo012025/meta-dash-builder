
export interface ColumnMapping {
  categoryName: string | null;
  title: string | null;
  city: string | null;
  phone: string | null;
  url: string | null;
  instagram: string | null;
  leads: string | null;
}

export interface ImportContactsProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: any[]) => void;
}
