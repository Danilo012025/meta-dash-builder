
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

interface FileUploadSectionProps {
  onFileUpload: (file: File) => void;
}

export function FileUploadSection({ onFileUpload }: FileUploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      ".xlsx",
      ".xls",
      ".csv"
    ];
    
    if (!validTypes.includes(file.type) && 
        !file.name.endsWith('.xlsx') && 
        !file.name.endsWith('.xls') && 
        !file.name.endsWith('.csv')) {
      setError("Tipo de arquivo inválido. Por favor, selecione um arquivo XLSX, XLS ou CSV.");
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileUpload(file);
        toast.success("Arquivo carregado com sucesso!");
      } else {
        toast.error("Formato de arquivo não suportado!");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        onFileUpload(file);
      } else {
        event.target.value = "";
      }
    }
  };

  return (
    <div 
      className={`flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg ${
        dragActive ? "border-primary bg-primary/10" : "border-muted"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="h-8 w-8 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium mb-1">
          Arraste e solte seu arquivo aqui ou
        </p>
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button variant="outline">Selecionar Arquivo</Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            onClick={() => setError(null)}
          />
        </label>
      </div>
      
      {error && (
        <div className="flex items-center text-destructive gap-1 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground">
        Arquivos suportados: XLSX, XLS, CSV
      </p>
    </div>
  );
}
