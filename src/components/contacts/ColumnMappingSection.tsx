
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

  // Define required fields
  const requiredFields: (keyof ColumnMapping)[] = ['categoryName', 'title', 'city', 'phone'];

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        <span className="text-sm font-medium">{fileName}</span>
      </div>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(mapping).map((field) => (
            <div key={field} className="mb-2">
              <label className="text-sm font-medium mb-1 block">
                {getFieldLabel(field)}
                {requiredFields.includes(field as keyof ColumnMapping) && 
                  <span className="text-destructive ml-1">*</span>
                }
              </label>
              <Select 
                value={mapping[field as keyof ColumnMapping] || 'none'} 
                onValueChange={(value) => onMapping(field as keyof ColumnMapping, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a coluna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
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
          <div className="text-sm text-muted-foreground max-h-48 overflow-y-auto">
            {previewData.slice(0, 2).map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-4 p-2 border rounded">
                {Object.entries(row).map(([key, value]) => (
                  <div key={key} className="overflow-hidden text-ellipsis">
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
