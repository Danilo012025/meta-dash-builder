
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadSectionProps {
  onFileUpload: (file: File) => void;
}

export function FileUploadSection({ onFileUpload }: FileUploadSectionProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
      <Upload className="h-8 w-8 text-muted-foreground" />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button variant="outline">Selecionar Arquivo</Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
        />
      </label>
      <p className="text-sm text-muted-foreground">
        Arquivos suportados: XLSX, XLS, CSV
      </p>
    </div>
  );
}
