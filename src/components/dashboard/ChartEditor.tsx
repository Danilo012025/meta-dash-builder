
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, XIcon } from "lucide-react";

interface Column {
  id: string;
  name: string;
  type: "text" | "number";
}

interface ChartEditorProps {
  data: any[];
  columns: Column[];
  onClose: () => void;
  onSave: (data: any[]) => void;
}

export function ChartEditor({ data, columns, onClose, onSave }: ChartEditorProps) {
  const [editableData, setEditableData] = useState<any[]>(
    JSON.parse(JSON.stringify(data))
  );

  const handleValueChange = (rowIndex: number, columnId: string, value: string) => {
    const newData = [...editableData];
    const column = columns.find(col => col.id === columnId);
    
    // Converter para número se o tipo da coluna for "number"
    if (column?.type === "number") {
      newData[rowIndex][columnId] = value === "" ? 0 : Number(value);
    } else {
      newData[rowIndex][columnId] = value;
    }
    
    setEditableData(newData);
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach(column => {
      newRow[column.id] = column.type === "number" ? 0 : "";
    });
    setEditableData([...editableData, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    const newData = [...editableData];
    newData.splice(index, 1);
    setEditableData(newData);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="bg-card border-border text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Dados do Gráfico</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          <Table className="border border-border">
            <TableHeader className="bg-muted/10">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id} className="text-white font-semibold">
                    {column.name}
                  </TableHead>
                ))}
                <TableHead className="w-16 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-border">
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Input
                        type={column.type}
                        value={row[column.id]}
                        onChange={(e) => handleValueChange(rowIndex, column.id, e.target.value)}
                        className="bg-muted text-white border-border"
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                      disabled={editableData.length <= 1}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-center my-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            className="border-dashed border-border text-brand-neon hover:bg-brand-neon/10"
          >
            <PlusIcon size={16} className="mr-1" /> Adicionar Linha
          </Button>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="border-border">
            <XIcon size={16} className="mr-1" /> Cancelar
          </Button>
          <Button onClick={() => onSave(editableData)} className="bg-brand-neon text-brand-black hover:bg-opacity-80">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
