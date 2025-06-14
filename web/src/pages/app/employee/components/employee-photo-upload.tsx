import type React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface EmployeePhotoUploadProps {
  urlPhoto: string | null;
  name: string;
  onPhotoChange: (file: File | null) => void;
}

export function EmployeePhotoUpload({
  urlPhoto,
  name,
  onPhotoChange,
}: EmployeePhotoUploadProps) {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(urlPhoto);
  const [isUploading, setIsUploading] = useState(false);

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onPhotoChange(file);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentPhoto(e.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setCurrentPhoto(null);
    onPhotoChange(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        {currentPhoto ? (
          <AvatarImage src={currentPhoto || "/placeholder.svg"} alt={name} />
        ) : (
          <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Enviando..." : "Alterar Foto"}
        </Button>

        {currentPhoto && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemovePhoto}
            disabled={isUploading}
          >
            <X className="h-4 w-4 mr-2" />
            Remover
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-48">
        Clique para alterar a foto do funcionário ou deixe vazio para usar as
        iniciais
      </p>
    </div>
  );
}
