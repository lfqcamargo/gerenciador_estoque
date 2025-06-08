"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Search } from "lucide-react";
import { EditFuncionarioDialog } from "./edit-funcionario-dialog";
import { DeleteFuncionarioDialog } from "./delete-funcionario-dialog";

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  status: string;
  dataContratacao: string;
}

interface FuncionariosTableProps {
  funcionarios: Funcionario[];
  onEdit: (id: string, data: Partial<Funcionario>) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function FuncionariosTable({
  funcionarios,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
}: FuncionariosTableProps) {
  const [editingFuncionario, setEditingFuncionario] =
    useState<Funcionario | null>(null);
  const [deletingFuncionario, setDeletingFuncionario] =
    useState<Funcionario | null>(null);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionário..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="hidden md:table-cell">
                Departamento
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Contratação
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funcionarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum funcionário encontrado
                </TableCell>
              </TableRow>
            ) : (
              funcionarios.map((funcionario) => (
                <TableRow key={funcionario.id}>
                  <TableCell className="font-medium">
                    {funcionario.nome}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {funcionario.email}
                  </TableCell>
                  <TableCell>{funcionario.cargo}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {funcionario.departamento}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        funcionario.status === "ativo" ? "default" : "secondary"
                      }
                    >
                      {funcionario.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(funcionario.dataContratacao)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingFuncionario(funcionario)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingFuncionario(funcionario)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingFuncionario && (
        <EditFuncionarioDialog
          funcionario={editingFuncionario}
          open={!!editingFuncionario}
          onOpenChange={(open) => {
            if (!open) setEditingFuncionario(null);
          }}
          onSave={(data) => {
            onEdit(editingFuncionario.id, data);
            setEditingFuncionario(null);
          }}
        />
      )}

      {deletingFuncionario && (
        <DeleteFuncionarioDialog
          funcionario={deletingFuncionario}
          open={!!deletingFuncionario}
          onOpenChange={(open) => {
            if (!open) setDeletingFuncionario(null);
          }}
          onConfirm={() => {
            onDelete(deletingFuncionario.id);
            setDeletingFuncionario(null);
          }}
        />
      )}
    </div>
  );
}
