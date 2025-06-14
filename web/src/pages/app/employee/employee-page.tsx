import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { EmployeesTable } from "./components/employees-table";
import { AddEmployeeDialog } from "./components/add-employee-dialog";
import { fetchUsers, type FetchUsersResponse } from "@/api/fetch-users";
import { toast } from "sonner";
import { deleteEmployeeAction } from "./actions/delete-employee-action";
import { Link } from "react-router-dom";
import { getAttachement } from "@/api/get-attachement";

type EmployeeWithPhoto = FetchUsersResponse["users"][number] & {
  photoUrl: string | null;
};

export function EmployeePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [employeesState, setEmployeesState] = useState<EmployeeWithPhoto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const employees = await fetchUsers();

        const employeesWithPhotoUrl = await Promise.all(
          employees.users.map(async (user) => {
            let photoUrl = null;

            if (user.photoId) {
              const attachement = await getAttachement({ id: user.photoId });
              photoUrl = attachement?.url || null;
            }

            return { ...user, photoUrl };
          })
        );

        setEmployeesState(employeesWithPhotoUrl);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar funcionários.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEmployees();
  }, []);

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

  if (isLoading) {
    return <p className="p-4">Carregando funcionários...</p>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/company">
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
