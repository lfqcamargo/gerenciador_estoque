"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building,
  MapPin,
  Navigation,
  Layers,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dados mockados linearizados para tabela
const locaisFlat = [
  {
    id: "1",
    codigo: "GAL01",
    nome: "Galpão Principal",
    tipo: "Local",
    hierarquia: "GAL01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1",
    codigo: "GAL01-A",
    nome: "Área A - Materiais Pesados",
    tipo: "Sub-local",
    hierarquia: "GAL01 > GAL01-A",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1-1",
    codigo: "GAL01-A-C01",
    nome: "Corredor 01",
    tipo: "Corredor",
    hierarquia: "GAL01 > GAL01-A > GAL01-A-C01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1-1-1",
    codigo: "GAL01-A-C01-P01",
    nome: "Prateleira 01",
    tipo: "Prateleira",
    hierarquia: "GAL01 > GAL01-A > GAL01-A-C01 > GAL01-A-C01-P01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1-1-1-1",
    codigo: "GAL01-A-C01-P01-01",
    nome: "Posição 01",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-A > GAL01-A-C01 > GAL01-A-C01-P01 > GAL01-A-C01-P01-01",
    materiais: 5,
    status: "ativo",
  },
  {
    id: "1-1-1-1-2",
    codigo: "GAL01-A-C01-P01-02",
    nome: "Posição 02",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-A > GAL01-A-C01 > GAL01-A-C01-P01 > GAL01-A-C01-P01-02",
    materiais: 3,
    status: "ativo",
  },
  {
    id: "1-1-1-1-3",
    codigo: "GAL01-A-C01-P01-03",
    nome: "Posição 03",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-A > GAL01-A-C01 > GAL01-A-C01-P01 > GAL01-A-C01-P01-03",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1-1-2",
    codigo: "GAL01-A-C01-P02",
    nome: "Prateleira 02",
    tipo: "Prateleira",
    hierarquia: "GAL01 > GAL01-A > GAL01-A-C01 > GAL01-A-C01-P02",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1-1-2-1",
    codigo: "GAL01-A-C01-P02-01",
    nome: "Posição 01",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-A > GAL01-A-C01 > GAL01-A-C01-P02 > GAL01-A-C01-P02-01",
    materiais: 2,
    status: "ativo",
  },
  {
    id: "1-1-1-2-2",
    codigo: "GAL01-A-C01-P02-02",
    nome: "Posição 02",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-A > GAL01-A-C01 > GAL01-A-C01-P02 > GAL01-A-C01-P02-02",
    materiais: 4,
    status: "ativo",
  },
  {
    id: "1-1-2",
    codigo: "GAL01-A-C02",
    nome: "Corredor 02",
    tipo: "Corredor",
    hierarquia: "GAL01 > GAL01-A > GAL01-A-C02",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1-2-1",
    codigo: "GAL01-A-C02-P01",
    nome: "Prateleira 01",
    tipo: "Prateleira",
    hierarquia: "GAL01 > GAL01-A > GAL01-A-C02 > GAL01-A-C02-P01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-1-2-1-1",
    codigo: "GAL01-A-C02-P01-01",
    nome: "Posição 01",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-A > GAL01-A-C02 > GAL01-A-C02-P01 > GAL01-A-C02-P01-01",
    materiais: 1,
    status: "ativo",
  },
  {
    id: "1-2",
    codigo: "GAL01-B",
    nome: "Área B - Materiais Leves",
    tipo: "Sub-local",
    hierarquia: "GAL01 > GAL01-B",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-2-1",
    codigo: "GAL01-B-C01",
    nome: "Corredor 01",
    tipo: "Corredor",
    hierarquia: "GAL01 > GAL01-B > GAL01-B-C01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-2-1-1",
    codigo: "GAL01-B-C01-P01",
    nome: "Prateleira 01",
    tipo: "Prateleira",
    hierarquia: "GAL01 > GAL01-B > GAL01-B-C01 > GAL01-B-C01-P01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "1-2-1-1-1",
    codigo: "GAL01-B-C01-P01-01",
    nome: "Posição 01",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-B > GAL01-B-C01 > GAL01-B-C01-P01 > GAL01-B-C01-P01-01",
    materiais: 8,
    status: "ativo",
  },
  {
    id: "1-2-1-1-2",
    codigo: "GAL01-B-C01-P01-02",
    nome: "Posição 02",
    tipo: "Posição",
    hierarquia:
      "GAL01 > GAL01-B > GAL01-B-C01 > GAL01-B-C01-P01 > GAL01-B-C01-P01-02",
    materiais: 6,
    status: "ativo",
  },
  {
    id: "2",
    codigo: "DEP01",
    nome: "Depósito Secundário",
    tipo: "Local",
    hierarquia: "DEP01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "2-1",
    codigo: "DEP01-A",
    nome: "Área Única",
    tipo: "Sub-local",
    hierarquia: "DEP01 > DEP01-A",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "2-1-1",
    codigo: "DEP01-A-C01",
    nome: "Corredor 01",
    tipo: "Corredor",
    hierarquia: "DEP01 > DEP01-A > DEP01-A-C01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "2-1-1-1",
    codigo: "DEP01-A-C01-P01",
    nome: "Prateleira 01",
    tipo: "Prateleira",
    hierarquia: "DEP01 > DEP01-A > DEP01-A-C01 > DEP01-A-C01-P01",
    materiais: 0,
    status: "ativo",
  },
  {
    id: "2-1-1-1-1",
    codigo: "DEP01-A-C01-P01-01",
    nome: "Posição 01",
    tipo: "Posição",
    hierarquia:
      "DEP01 > DEP01-A > DEP01-A-C01 > DEP01-A-C01-P01 > DEP01-A-C01-P01-01",
    materiais: 12,
    status: "ativo",
  },
];

interface LocaisTableProps {
  searchTerm: string;
}

export function LocaisTable({ searchTerm }: LocaisTableProps) {
  const filteredLocais = locaisFlat.filter(
    (local) =>
      local.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      local.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      local.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      local.hierarquia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoBadge = (tipo: string) => {
    const config = {
      Local: { color: "bg-blue-100 text-blue-800", icon: Building },
      "Sub-local": { color: "bg-green-100 text-green-800", icon: MapPin },
      Corredor: { color: "bg-yellow-100 text-yellow-800", icon: Navigation },
      Prateleira: { color: "bg-purple-100 text-purple-800", icon: Layers },
      Posição: { color: "bg-gray-100 text-gray-800", icon: Package },
    };

    const { color, icon: Icon } =
      config[tipo as keyof typeof config] || config["Posição"];

    return (
      <Badge variant="default" className={color}>
        <Icon className="mr-1 h-3 w-3" />
        {tipo}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ativo
          </Badge>
        );
      case "inativo":
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Hierarquia</TableHead>
          <TableHead className="text-right">Materiais</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredLocais.map((local) => (
          <TableRow key={local.id}>
            <TableCell className="font-medium font-mono text-sm">
              {local.codigo}
            </TableCell>
            <TableCell>{local.nome}</TableCell>
            <TableCell>{getTipoBadge(local.tipo)}</TableCell>
            <TableCell className="max-w-[300px]">
              <span className="text-xs text-muted-foreground font-mono">
                {local.hierarquia}
              </span>
            </TableCell>
            <TableCell className="text-right">
              {local.materiais > 0 ? (
                <Badge variant="secondary">{local.materiais}</Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>{getStatusBadge(local.status)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
