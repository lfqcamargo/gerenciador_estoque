import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompanyAvatarProps {
  name: string;
  photo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CompanyAvatar({
  name,
  photo,
  size = "md",
  className = "",
}: CompanyAvatarProps) {
  // Função para gerar iniciais da empresa
  const getCompanyInitials = (companyName: string) => {
    const words = companyName.trim().split(/\s+/);

    if (words.length === 1) {
      // Se for uma palavra só, pega as duas primeiras letras
      return words[0].substring(0, 2).toUpperCase();
    }

    // Pega a primeira letra da primeira palavra e primeira letra da última palavra
    const firstLetter = words[0].charAt(0);
    const lastLetter = words[words.length - 1].charAt(0);

    return (firstLetter + lastLetter).toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {photo && (
        <AvatarImage
          src={photo || "/placeholder.svg"}
          alt={`Logo da ${name}`}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
        {name ? getCompanyInitials(name) : <Building2 className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
