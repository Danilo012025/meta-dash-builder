
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import type { Contact } from "@/types/contacts";

interface AddContactFormProps {
  onSubmit: (contact: Omit<Contact, "id" | "status" | "lastContactDate">) => void;
  onCancel: () => void;
  initialData?: Partial<Contact>;
  isEditing?: boolean;
}

export function AddContactForm({ onSubmit, onCancel, initialData, isEditing = false }: AddContactFormProps) {
  const [formData, setFormData] = useState({
    categoryName: initialData?.categoryName || "",
    title: initialData?.title || "",
    city: initialData?.city || "",
    phone: initialData?.phone || "",
    url: initialData?.url || "",
    instagram: initialData?.instagram || "",
    leads: initialData?.leads || "",
    notes: initialData?.notes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="categoryName">Categoria</Label>
          <Input
            id="categoryName"
            value={formData.categoryName}
            onChange={(e) => setFormData((prev) => ({ ...prev, categoryName: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="leads">Leads</Label>
          <Input
            id="leads"
            value={formData.leads}
            onChange={(e) => setFormData((prev) => ({ ...prev, leads: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="resize-none"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Contato'}</Button>
      </DialogFooter>
    </form>
  );
}
