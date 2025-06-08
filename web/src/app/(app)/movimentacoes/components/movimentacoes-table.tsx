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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Dados mockados
const movimentacoes = [
  {
    id: "1",
    data: "2024-12-06T10:30:00",
    tipo: "entrada",
    material: "Parafuso M6x20",
    codigo: "PAR001",
    quantidade: 100,
    valorUnitario: 0.25,
    valorTotal: 25.0,
    usuario: "João Silva",
    observacao: "Compra fornecedor ABC",
    documento: "NF-001234",
  },
  {
    id: "2",
    data: "2024-12-06T09:15:00",
    tipo: "saida",
    material: "Chapa de Aço 2mm",
    codigo: "CHA001",
    quantidade: 5,
    valorUnitario: 45.0,
    valorTotal: 225.0,
    usuario: "Maria Santos",
    observacao: "Uso em projeto XYZ",
    documento: "REQ-5678",
  },
  {
    id: "3",
    data: "2024-12-06T08:45:00",
    tipo: "entrada",
    material: "Tinta Branca 1L",
    codigo: "TIN001",
    quantidade: 20,
    valorUnitario: 25.9,
    valorTotal: 518.0,
    usuario: "Pedro Costa",
    observacao: "Reposição de estoque",
    documento: "NF-001235",
  },
  {
    id: "4",
    data: "2024-12-05T16:20:00",
    tipo: "ajuste",
    material: "Cabo Elétrico 2.5mm",
    codigo: "CAB001",
    quantidade: -10,
    valorUnitario: 2.5,
    valorTotal: -25.0,
    usuario: "Ana Lima",
    observacao: "Correção de inventário",
    documento: "AJ-001",
  },
  {
    id: "5",
    data: "2024-12-05T14:10:00",
    tipo: "saida",
    material: "Parafuso M6x20",
    codigo: "PAR001",
    quantidade: 50,
    valorUnitario: 0.25,
    valorTotal: 12.5,
    usuario: "Carlos Oliveira",
    observacao: "Manutenção equipamento",
    documento: "REQ-5679",
  },
];

interface MovimentacoesTableProps {
  searchTerm: string;
  filters: any;
}

export function MovimentacoesTable({
  searchTerm,
  filters,
}: MovimentacoesTableProps) {
  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    const matchesSearch =
      mov.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.observacao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = filters.tipo === "todos" || mov.tipo === filters.tipo;
    const matchesMaterial =
      !filters.material || mov.codigo === filters.material;

    return matchesSearch && matchesTipo && matchesMaterial;
  });

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "entrada":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Entrada
          </Badge>
        );
      case "saida":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            Saída
          </Badge>
        );
      case "ajuste":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Ajuste
          </Badge>
        );
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const formatQuantidade = (quantidade: number, tipo: string) => {
    const prefix = tipo === "entrada" ? "+" : tipo === "saida" ? "-" : "";
    return `${prefix}${Math.abs(quantidade)}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data/Hora</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Material</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Valor Unit.</TableHead>
          <TableHead className="text-right">Valor Total</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMovimentacoes.map((mov) => (
          <TableRow key={mov.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">
                  {new Date(mov.data).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(mov.data).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>{getTipoBadge(mov.tipo)}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{mov.material}</span>
                <span className="text-xs text-muted-foreground">
                  {mov.codigo}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">
              <span
                className={
                  mov.tipo === "entrada"
                    ? "text-green-600"
                    : mov.tipo === "saida"
                    ? "text-red-600"
                    : "text-blue-600"
                }
              >
                {formatQuantidade(mov.quantidade, mov.tipo)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              R$ {mov.valorUnitario.toFixed(2)}
            </TableCell>
            <TableCell className="text-right font-medium">
              <span
                className={
                  mov.valorTotal >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                R$ {Math.abs(mov.valorTotal).toFixed(2)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {mov.usuario
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{mov.usuario}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-xs font-mono">{mov.documento}</span>
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
