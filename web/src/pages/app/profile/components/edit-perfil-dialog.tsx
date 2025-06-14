import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Funcionario {
  id: string;
  nome: string;
  foto?: string | null;
}

interface EditPerfilDialogProps {
  funcionario: Funcionario;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Funcionario>) => void;
}

export function EditPerfilDialog({
  funcionario,
  open,
  onOpenChange,
  onSave,
}: EditPerfilDialogProps) {
  const [formData, setFormData] = useState<Funcionario>({
    id: "",
    nome: "",
    foto: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (funcionario) {
      setFormData(funcionario);
      setPreviewUrl(funcionario.foto || null);
    }
  }, [funcionario]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setFormData((prev) => ({ ...prev, foto: result }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemovePhoto() {
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, foto: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações pessoais
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Upload de Foto */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={previewUrl || undefined}
                    alt={formData.nome}
                  />
                  <AvatarFallback className="text-lg">
                    {formData.nome.split(" ")[0].charAt(0)}
                    {formData.nome.split(" ")[1].charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  onClick={handlePhotoClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePhotoClick}
                >
                  Alterar Foto
                </Button>
                {previewUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
