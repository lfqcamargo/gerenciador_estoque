"use client";

import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { EmployeesTable } from "./employees-table";
import { AddEmployeeDialog } from "./add-employee-dialog";
import Link from "next/link";
import { FetchUsersResponse } from "@/http/fetch-users";
import { toast } from "sonner";
import { deleteEmployeeAction } from "../actions/delete-employee-action";

interface EmployeeContentProps {
  employees: (FetchUsersResponse["users"][number] & {
    photoUrl: string | null;
  })[];
}

export function EmployeeContent({ employees }: EmployeeContentProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [employeesState, setEmployeesState] = useState(() => [
    ...(employees ?? []),
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employeesState.filter((emp) =>
    [emp.name, emp.email, emp.role]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  async function handleDeleteEmployee(id: string) {
    try {
      const result = await deleteEmployeeAction(id);
      if (result.success) {
        setEmployeesState((prev) => prev.filter((emp) => emp.id !== id));
        toast.success("Funcionário excluído com sucesso.");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir funcionário.");
    }
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

      <EmployeesTable
        employees={filteredEmployees}
        onDelete={handleDeleteEmployee}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <AddEmployeeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
