"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface CompanyPhotoUploadProps {
  photo: string | null;
  name: string;
  onPhotoChange: (file: File) => void;
}

export function CompanyPhotoUpload({
  photo,
  name,
  onPhotoChange,
}: CompanyPhotoUploadProps) {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(photo);
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onPhotoChange(file);
    setIsUploading(true);

    // Simulando upload - em produção, isso seria uma chamada à API
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentPhoto(e.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setCurrentPhoto(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-40 w-40">
        {currentPhoto ? (
          <AvatarImage src={currentPhoto || "/placeholder.svg"} alt={name} />
        ) : (
          <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
            {name.slice(0, 2).toUpperCase()}
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
          {isUploading ? "Enviando..." : "Alterar Logo"}
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
    </div>
  );
}
