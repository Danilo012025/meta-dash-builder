
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, ArrowDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from 'xlsx';

interface ImportContactsProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: any[]) => void;
}

interface ColumnMapping {
  categoryName: string | null;
  title: string | null;
  city: string | null;
  phone: string | null;
  url: string | null;
  instagram: string | null;
  leads: string | null;
}

export function ImportContacts({ isOpen, onClose, onImport }: ImportContactsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    categoryName: null,
    title: null,
    city: null,
    phone: null,
    url: null,
    instagram: null,
    leads: null
  });
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFile(file);
      const data = await readExcelFile(file);
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        setHeaders(headers);
        setPreviewData(data.slice(0, 3));
        toast.success("Arquivo carregado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      toast.error("Erro ao ler arquivo. Certifique-se que é um arquivo Excel válido.");
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const handleMapping = (field: keyof ColumnMapping, value: string) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImport = async () => {
    if (!file || !previewData.length) {
      toast.error("Por favor, selecione um arquivo primeiro.");
      return;
    }

    const requiredFields: (keyof ColumnMapping)[] = ['categoryName', 'title', 'city', 'phone'];
    const missingFields = requiredFields.filter(field => !mapping[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Por favor, mapeie os campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const data = await readExcelFile(file);
      const formattedContacts = data.map((row, index) => ({
        id: String(Date.now() + index),
        categoryName: row[mapping.categoryName!],
        title: row[mapping.title!],
        city: row[mapping.city!],
        phone: row[mapping.phone!],
        url: row[mapping.url!] || '',
        instagram: row[mapping.instagram!] || '',
        leads: row[mapping.leads!] || '',
        status: "não contatado"
      }));

      onImport(formattedContacts);
      toast.success("Contatos importados com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao importar contatos:", error);
      toast.error("Erro ao importar contatos. Tente novamente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Contatos via Planilha
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {!file && (
            <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline">Selecionar Arquivo</Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-sm text-muted-foreground">
                Arquivos suportados: XLSX, XLS, CSV
              </p>
            </div>
          )}

          {file && headers.length > 0 && (
            <>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(mapping).map((field) => (
                      <div key={field}>
                        <label className="text-sm font-medium mb-1 block">
                          {field === 'categoryName' ? 'Categoria' :
                           field === 'title' ? 'Título' :
                           field === 'city' ? 'Cidade' :
                           field === 'phone' ? 'Telefone' :
                           field === 'url' ? 'URL' :
                           field === 'instagram' ? 'Instagram' :
                           'Leads'}
                        </label>
                        <Select 
                          value={mapping[field as keyof ColumnMapping] || ''} 
                          onValueChange={(value) => handleMapping(field as keyof ColumnMapping, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a coluna" />
                          </SelectTrigger>
                          <SelectContent>
                            {headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {previewData.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Preview dos dados:</h4>
                  <div className="text-sm text-muted-foreground">
                    {previewData.slice(0, 2).map((row, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                        {Object.entries(row).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleImport} className="w-full mt-4">
                <ArrowDown className="mr-2 h-4 w-4" />
                Importar Contatos
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
