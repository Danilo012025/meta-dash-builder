
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
  name: string | null;
  phone: string | null;
  instagram: string | null;
  address: string | null;
}

export function ImportContacts({ isOpen, onClose, onImport }: ImportContactsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    name: null,
    phone: null,
    instagram: null,
    address: null,
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
        setPreviewData(data.slice(0, 3)); // Preview primeiras 3 linhas
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

    // Verifica se todos os campos necessários foram mapeados
    if (!mapping.name || !mapping.phone || !mapping.instagram || !mapping.address) {
      toast.error("Por favor, mapeie todos os campos necessários.");
      return;
    }

    try {
      const data = await readExcelFile(file);
      const formattedContacts = data.map((row, index) => ({
        id: String(Date.now() + index),
        name: row[mapping.name!],
        phone: row[mapping.phone!],
        instagram: row[mapping.instagram!],
        address: row[mapping.address!],
        status: "não contatado",
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
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nome</label>
                      <Select value={mapping.name || ''} onValueChange={(value) => handleMapping('name', value)}>
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
                    <div>
                      <label className="text-sm font-medium mb-1 block">Telefone</label>
                      <Select value={mapping.phone || ''} onValueChange={(value) => handleMapping('phone', value)}>
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
                    <div>
                      <label className="text-sm font-medium mb-1 block">Instagram</label>
                      <Select value={mapping.instagram || ''} onValueChange={(value) => handleMapping('instagram', value)}>
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
                    <div>
                      <label className="text-sm font-medium mb-1 block">Endereço</label>
                      <Select value={mapping.address || ''} onValueChange={(value) => handleMapping('address', value)}>
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
