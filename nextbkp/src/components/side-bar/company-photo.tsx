"use client";

import { Building2 } from "lucide-react";

interface CompanyPhotoProps {
  name: string;
  photo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CompanyPhoto({
  name,
  photo,
  size = "md",
  className = "",
}: CompanyPhotoProps) {
  // Função para gerar iniciais da empresa
  const getCompanyInitials = (companyName: string) => {
    const words = companyName.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    const firstLetter = words[0].charAt(0);
    const lastLetter = words[words.length - 1].charAt(0);
    return (firstLetter + lastLetter).toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  if (photo) {
    return (
      <img
        src={photo}
        alt={`Logo da ${name}`}
        className={`${sizeClasses[size]} rounded-lg object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center ${className}`}
    >
      {name ? getCompanyInitials(name) : <Building2 className="h-4 w-4" />}
    </div>
  );
}
