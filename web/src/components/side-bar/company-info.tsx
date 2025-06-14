import { Building2, Edit3 } from "lucide-react";
import { CompanyPhoto } from "./company-photo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface Company {
  id: string;
  cnpj: string;
  name: string;
  createdAt: string;
  lealName?: string | null;
  photo?: string | null;
}

interface CompanyInfoProps {
  company: Company;
  isCollapsed?: boolean;
}

export function CompanyInfo({
  company,
  isCollapsed = false,
}: CompanyInfoProps) {
  // Função para formatar CNPJ
  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  // Função para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (isCollapsed) {
    return (
      <div
        className="flex items-center justify-center p-2"
        title={company.name}
      >
        <CompanyPhoto name={company.name} photo={company.photo} size="sm" />
      </div>
    );
  }

  return (
    <div className="p-3 border-b border-sidebar-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-auto p-2 justify-start hover:bg-sidebar-accent group"
          >
            <div className="flex items-center gap-3 w-full">
              <CompanyPhoto
                name={company.name}
                photo={company.photo}
                size="md"
              />
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">
                    {truncateText(company.name, 20)}
                  </h3>
                  <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {company.lealName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {truncateText(company.lealName, 25)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatCNPJ(company.cnpj)}
                </p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-80">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <CompanyPhoto
                name={company.name}
                photo={company.photo}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base">{company.name}</h3>
                {company.lealName && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {company.lealName}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    CNPJ: {formatCNPJ(company.cnpj)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={"/company"}>
              <Building2 className="h-4 w-4 mr-2" />
              Editar Empresa
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Edit3 className="h-4 w-4 mr-2" />
            Funcionários
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
