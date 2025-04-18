
import { FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ColumnMapping } from "@/types/import";

interface ColumnMappingSectionProps {
  fileName: string;
  headers: string[];
  mapping: ColumnMapping;
  onMapping: (field: keyof ColumnMapping, value: string) => void;
  previewData: any[];
}

export function ColumnMappingSection({ 
  fileName, 
  headers, 
  mapping, 
  onMapping,
  previewData 
}: ColumnMappingSectionProps) {
  const getFieldLabel = (field: string): string => {
    switch (field) {
      case 'categoryName': return 'Categoria';
      case 'title': return 'Título';
      case 'city': return 'Cidade';
      case 'phone': return 'Telefone';
      case 'url': return 'URL';
      case 'instagram': return 'Instagram';
      case 'leads': return 'Leads';
      default: return field;
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        <span className="text-sm font-medium">{fileName}</span>
      </div>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(mapping).map((field) => (
            <div key={field}>
              <label className="text-sm font-medium mb-1 block">
                {getFieldLabel(field)}
              </label>
              <Select 
                value={mapping[field as keyof ColumnMapping] || ''} 
                onValueChange={(value) => onMapping(field as keyof ColumnMapping, value)}
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
    </div>
  );
}
