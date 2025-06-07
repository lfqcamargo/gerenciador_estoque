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
import { MoreHorizontal, Edit, Trash2, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dados mockados com locais
const materiais = [
  {
    id: "1",
    codigo: "PAR001",
    nome: "Parafuso M6x20",
    grupo: "Fixação",
    unidade: "UN",
    quantidade: 150,
    minimo: 50,
    valor: 0.25,
    status: "normal",
    local: "GAL01-A-C01-P01-01",
    localNome:
      "Galpão Principal > Área A > Corredor 01 > Prateleira 01 > Posição 01",
  },
  {
    id: "2",
    codigo: "CHA001",
    nome: "Chapa de Aço 2mm",
    grupo: "Chapas",
    unidade: "M²",
    quantidade: 25,
    minimo: 30,
    valor: 45.0,
    status: "baixo",
    local: "GAL01-A-C01-P02-01",
    localNome:
      "Galpão Principal > Área A > Corredor 01 > Prateleira 02 > Posição 01",
  },
  {
    id: "3",
    codigo: "TIN001",
    nome: "Tinta Branca 1L",
    grupo: "Tintas",
    unidade: "L",
    quantidade: 0,
    minimo: 10,
    valor: 25.9,
    status: "zerado",
    local: "GAL01-B-C01-P01-01",
    localNome:
      "Galpão Principal > Área B > Corredor 01 > Prateleira 01 > Posição 01",
  },
  {
    id: "4",
    codigo: "CAB001",
    nome: "Cabo Elétrico 2.5mm",
    grupo: "Elétricos",
    unidade: "M",
    quantidade: 500,
    minimo: 100,
    valor: 2.5,
    status: "normal",
    local: "DEP01-A-C01-P01-01",
    localNome:
      "Depósito Secundário > Área Única > Corredor 01 > Prateleira 01 > Posição 01",
  },
];

interface MateriaisTableProps {
  searchTerm: string;
}

export function MateriaisTable({ searchTerm }: MateriaisTableProps) {
  const filteredMateriais = materiais.filter(
    (material) =>
      material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.localNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Normal
          </Badge>
        );
      case "baixo":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Baixo
          </Badge>
        );
      case "zerado":
        return <Badge variant="destructive">Zerado</Badge>;
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
          <TableHead>Grupo</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Mínimo</TableHead>
          <TableHead className="text-right">Valor Unit.</TableHead>
          <TableHead>Local</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMateriais.map((material) => (
          <TableRow key={material.id}>
            <TableCell className="font-medium">{material.codigo}</TableCell>
            <TableCell>{material.nome}</TableCell>
            <TableCell>{material.grupo}</TableCell>
            <TableCell>{material.unidade}</TableCell>
            <TableCell className="text-right">{material.quantidade}</TableCell>
            <TableCell className="text-right">{material.minimo}</TableCell>
            <TableCell className="text-right">
              R$ {material.valor.toFixed(2)}
            </TableCell>
            <TableCell className="max-w-[200px]">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-mono">{material.local}</span>
              </div>
              <div
                className="text-xs text-muted-foreground truncate"
                title={material.localNome}
              >
                {material.localNome}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(material.status)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MapPin className="mr-2 h-4 w-4" />
                    Alterar Local
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
