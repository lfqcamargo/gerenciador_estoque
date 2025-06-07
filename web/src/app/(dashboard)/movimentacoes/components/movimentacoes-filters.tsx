"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MovimentacoesFiltersProps {
  filters: {
    tipo: string;
    periodo: string;
    material: string;
    usuario: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function MovimentacoesFilters({
  filters,
  onFiltersChange,
}: MovimentacoesFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({
      tipo: "todos",
      periodo: "30",
      material: "",
      usuario: "",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.tipo}
        onValueChange={(value) => onFiltersChange({ ...filters, tipo: value })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os tipos</SelectItem>
          <SelectItem value="entrada">Entrada</SelectItem>
          <SelectItem value="saida">Saída</SelectItem>
          <SelectItem value="ajuste">Ajuste</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.periodo}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, periodo: value })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Últimos 7 dias</SelectItem>
          <SelectItem value="30">Últimos 30 dias</SelectItem>
          <SelectItem value="90">Últimos 90 dias</SelectItem>
          <SelectItem value="365">Último ano</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.material}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, material: value })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Material" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os materiais</SelectItem>
          <SelectItem value="PAR001">Parafuso M6x20</SelectItem>
          <SelectItem value="CHA001">Chapa de Aço 2mm</SelectItem>
          <SelectItem value="TIN001">Tinta Branca 1L</SelectItem>
          <SelectItem value="CAB001">Cabo Elétrico 2.5mm</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={clearFilters}>
        <X className="h-4 w-4 mr-1" />
        Limpar
      </Button>
    </div>
  );
}
