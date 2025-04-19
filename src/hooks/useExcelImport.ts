
import { useState } from "react";
import * as XLSX from 'xlsx';
import { toast } from "@/components/ui/sonner";
import type { ColumnMapping } from "@/types/import";

export const useExcelImport = () => {
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

  const resetImport = () => {
    setFile(null);
    setHeaders([]);
    setMapping({
      categoryName: null,
      title: null,
      city: null,
      phone: null,
      url: null,
      instagram: null,
      leads: null
    });
    setPreviewData([]);
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

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      setFile(uploadedFile);
      const data = await readExcelFile(uploadedFile);
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        setHeaders(headers);
        setPreviewData(data.slice(0, 3));
        
        // Auto-map columns if their names match fields
        const initialMapping: ColumnMapping = {
          categoryName: null,
          title: null,
          city: null,
          phone: null,
          url: null,
          instagram: null,
          leads: null
        };
        
        // Try to find matching column names (case insensitive)
        headers.forEach(header => {
          const headerLower = header.toLowerCase();
          if (headerLower.includes('categ')) initialMapping.categoryName = header;
          else if (headerLower.includes('titul') || headerLower.includes('titl') || headerLower.includes('nome')) initialMapping.title = header;
          else if (headerLower.includes('cidad')) initialMapping.city = header;
          else if (headerLower.includes('tele') || headerLower.includes('fone')) initialMapping.phone = header;
          else if (headerLower.includes('url') || headerLower.includes('site')) initialMapping.url = header;
          else if (headerLower.includes('insta')) initialMapping.instagram = header;
          else if (headerLower.includes('lead')) initialMapping.leads = header;
        });
        
        setMapping(initialMapping);
        toast.success("Arquivo carregado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      toast.error("Erro ao ler arquivo. Certifique-se que é um arquivo Excel válido.");
    }
  };

  const handleMapping = (field: keyof ColumnMapping, value: string) => {
    setMapping(prev => ({
      ...prev,
      [field]: value === "" ? null : value
    }));
  };

  return {
    file,
    headers,
    mapping,
    previewData,
    handleFileUpload,
    handleMapping,
    readExcelFile,
    resetImport
  };
};
