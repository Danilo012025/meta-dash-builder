
import { ArrowDown, FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { useExcelImport } from "@/hooks/useExcelImport";
import { FileUploadSection } from "./FileUploadSection";
import { ColumnMappingSection } from "./ColumnMappingSection";
import type { ImportContactsProps } from "@/types/import";

export function ImportContacts({ isOpen, onClose, onImport }: ImportContactsProps) {
  const {
    file,
    headers,
    mapping,
    previewData,
    handleFileUpload,
    handleMapping,
    readExcelFile,
    resetImport,
    selectedCategory,
    setSelectedCategory
  } = useExcelImport();

  const handleImport = async () => {
    if (!file || !previewData.length) {
      toast.error("Por favor, selecione um arquivo primeiro.");
      return;
    }

    const requiredFields: (keyof typeof mapping)[] = ['categoryName', 'title', 'city', 'phone'];
    const missingFields = requiredFields.filter(field => !mapping[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Por favor, mapeie os campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const data = await readExcelFile(file);
      
      // Remove duplicates based on title and phone
      const uniqueMap = new Map();
      const uniqueContacts = [];
      
      for (const row of data) {
        // Skip rows that don't have the required fields
        if (!mapping.title || !row[mapping.title] || !mapping.phone || !row[mapping.phone]) {
          continue;
        }
        
        const key = `${row[mapping.title]}-${row[mapping.phone]}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, true);
          uniqueContacts.push(row);
        }
      }
      
      if (uniqueContacts.length < data.length) {
        toast.info(`${data.length - uniqueContacts.length} contatos duplicados foram removidos.`);
      }
      
      const formattedContacts = uniqueContacts.map((row, index) => ({
        id: String(Date.now() + index),
        categoryName: selectedCategory === 'clinicas' ? 'Clínica' : 'Ótica',
        title: row[mapping.title!],
        city: row[mapping.city!],
        phone: row[mapping.phone!],
        url: mapping.url && row[mapping.url] ? row[mapping.url] : '',
        instagram: mapping.instagram && row[mapping.instagram] ? row[mapping.instagram] : '',
        leads: mapping.leads && row[mapping.leads] ? row[mapping.leads] : '',
        status: "não contatado"
      }));

      // Debug log to check formatted contacts
      console.log("Contatos formatados:", formattedContacts);

      onImport(formattedContacts);
      toast.success("Contatos importados com sucesso!");
      resetImport();
      onClose();
    } catch (error) {
      console.error("Erro ao importar contatos:", error);
      toast.error("Erro ao importar contatos. Tente novamente.");
    }
  };

  const handleBack = () => {
    resetImport();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetImport();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Contatos via Planilha
          </DialogTitle>
          <DialogDescription>
            Selecione a categoria e faça o upload da planilha correspondente.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="clinicas" onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="clinicas">Clínicas</TabsTrigger>
            <TabsTrigger value="oticas">Óticas</TabsTrigger>
          </TabsList>

          <TabsContent value="clinicas">
            <div className="grid gap-6 py-4">
              {!file && <FileUploadSection onFileUpload={handleFileUpload} />}
              {file && headers.length > 0 && (
                <>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1" 
                      onClick={handleBack}
                    >
                      <ArrowLeft className="h-4 w-4" /> Voltar
                    </Button>
                  </div>
                  
                  <ColumnMappingSection
                    fileName={file.name}
                    headers={headers}
                    mapping={mapping}
                    onMapping={handleMapping}
                    previewData={previewData}
                  />

                  <Button onClick={handleImport} className="w-full mt-4">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Importar Contatos
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="oticas">
            <div className="grid gap-6 py-4">
              {!file && <FileUploadSection onFileUpload={handleFileUpload} />}
              {file && headers.length > 0 && (
                <>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1" 
                      onClick={handleBack}
                    >
                      <ArrowLeft className="h-4 w-4" /> Voltar
                    </Button>
                  </div>
                  
                  <ColumnMappingSection
                    fileName={file.name}
                    headers={headers}
                    mapping={mapping}
                    onMapping={handleMapping}
                    previewData={previewData}
                  />

                  <Button onClick={handleImport} className="w-full mt-4">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Importar Contatos
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
