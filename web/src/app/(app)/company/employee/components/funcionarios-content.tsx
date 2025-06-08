"use client";

import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { FuncionariosTable } from "./funcionarios-table";
import { AddFuncionarioDialog } from "./add-funcionario-dialog";
import Link from "next/link";

// Dados de exemplo - em produção viriam da API
const funcionariosData = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@empresa.com",
    cargo: "Desenvolvedor",
    departamento: "TI",
    status: "ativo",
    dataContratacao: "2022-01-15",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    email: "maria.oliveira@empresa.com",
    cargo: "Designer",
    departamento: "Marketing",
    status: "ativo",
    dataContratacao: "2021-11-05",
  },
  {
    id: "3",
    nome: "Pedro Santos",
    email: "pedro.santos@empresa.com",
    cargo: "Analista",
    departamento: "Financeiro",
    status: "inativo",
    dataContratacao: "2020-03-22",
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana.costa@empresa.com",
    cargo: "Gerente",
    departamento: "Operações",
    status: "ativo",
    dataContratacao: "2019-07-10",
  },
  {
    id: "5",
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@empresa.com",
    cargo: "Assistente",
    departamento: "RH",
    status: "ativo",
    dataContratacao: "2023-02-28",
  },
];

export function FuncionariosContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState(funcionariosData);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFuncionarios = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleAddFuncionario(newFuncionario: any) {
    setFuncionarios([
      ...funcionarios,
      { ...newFuncionario, id: (funcionarios.length + 1).toString() },
    ]);
  }

  function handleEditFuncionario(id: string, updatedData: any) {
    setFuncionarios(
      funcionarios.map((func) =>
        func.id === id ? { ...func, ...updatedData } : func
      )
    );
  }

  function handleDeleteFuncionario(id: string) {
    setFuncionarios(funcionarios.filter((func) => func.id !== id));
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/company">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
            <p className="text-muted-foreground">
              Gerencie os funcionários da sua empresa
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      <FuncionariosTable
        funcionarios={filteredFuncionarios}
        onEdit={handleEditFuncionario}
        onDelete={handleDeleteFuncionario}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <AddFuncionarioDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddFuncionario}
      />
    </div>
  );
}
