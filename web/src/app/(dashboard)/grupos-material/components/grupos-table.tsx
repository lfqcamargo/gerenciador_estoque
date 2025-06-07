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
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dados mockados
const grupos = [
  {
    id: "1",
    codigo: "FIX",
    nome: "Fixação",
    descricao: "Parafusos, porcas, arruelas e outros materiais de fixação",
    quantidadeMateriais: 45,
    ativo: true,
    dataCriacao: "2024-01-15",
  },
  {
    id: "2",
    codigo: "CHA",
    nome: "Chapas",
    descricao: "Chapas de aço, alumínio e outros metais",
    quantidadeMateriais: 12,
    ativo: true,
    dataCriacao: "2024-01-20",
  },
  {
    id: "3",
    codigo: "TIN",
    nome: "Tintas",
    descricao: "Tintas, vernizes e produtos para pintura",
    quantidadeMateriais: 28,
    ativo: true,
    dataCriacao: "2024-02-01",
  },
  {
    id: "4",
    codigo: "ELE",
    nome: "Elétricos",
    descricao: "Cabos, fios, conectores e materiais elétricos",
    quantidadeMateriais: 67,
    ativo: true,
    dataCriacao: "2024-02-10",
  },
  {
    id: "5",
    codigo: "FER",
    nome: "Ferramentas",
    descricao: "Ferramentas manuais e elétricas",
    quantidadeMateriais: 0,
    ativo: false,
    dataCriacao: "2024-03-01",
  },
];

interface GruposTableProps {
  searchTerm: string;
}

export function GruposTable({ searchTerm }: GruposTableProps) {
  const filteredGrupos = grupos.filter(
    (grupo) =>
      grupo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grupo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grupo.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="text-right">Materiais</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data Criação</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredGrupos.map((grupo) => (
          <TableRow key={grupo.id}>
            <TableCell className="font-medium">{grupo.codigo}</TableCell>
            <TableCell>{grupo.nome}</TableCell>
            <TableCell className="max-w-[300px] truncate">
              {grupo.descricao}
            </TableCell>
            <TableCell className="text-right">
              {grupo.quantidadeMateriais}
            </TableCell>
            <TableCell>
              {grupo.ativo ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Ativo
                </Badge>
              ) : (
                <Badge variant="secondary">Inativo</Badge>
              )}
            </TableCell>
            <TableCell>
              {new Date(grupo.dataCriacao).toLocaleDateString("pt-BR")}
            </TableCell>
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
