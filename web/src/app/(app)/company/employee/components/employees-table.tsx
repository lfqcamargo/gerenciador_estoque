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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit2,
  Trash2,
  Search,
  MoreHorizontal,
  Mail,
  Calendar,
  Clock,
  Users,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditEmployeeDialog } from "./edit-employee-dialog";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import { roleUser } from "@/utils/role-user";

interface Employee {
  companyId: string;
  id: string;
  name: string;
  email: string;
  photoId: string | null;
  photoUrl: string | null;
  role: string;
  active: boolean;
  createdAt: string;
  lastLogin: string | null;
}

interface EmployeesTableProps {
  employees: Employee[];
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isLoading?: boolean;
}

type SortField = "nome" | "email" | "cargo" | "dataContratacao";
type SortDirection = "asc" | "desc";

export function EmployeesTable({
  employees,
  onDelete,
  searchTerm,
  onSearchChange,
  isLoading = false,
}: EmployeesTableProps) {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cargoFilter, setCargoFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("nome");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredAndSortedEmployees = employees
    .filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || employee.active.toString() === statusFilter;
      const matchesCargo =
        cargoFilter === "all" || employee.role === cargoFilter;
      return matchesSearch && matchesStatus && matchesCargo;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof Employee];
      const bValue = b[sortField as keyof Employee];
      const direction = sortDirection === "asc" ? 1 : -1;

      // Se os valores forem strings, use localeCompare
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * direction;
      }

      // Se forem booleanos, converta para número para comparar (false = 0, true = 1)
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return (Number(aValue) - Number(bValue)) * direction;
      }

      // Para outros tipos (ex: undefined), só retorna 0 (sem ordenação)
      return 0;
    });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Agora";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d atrás`;
    return formatDate(dateString);
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getStatusColor(status: string) {
    return status === "ativo"
      ? "bg-green-100 text-green-800 hover:bg-green-200"
      : "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }

  function getCargoColor(cargo: string) {
    const colors = {
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-blue-100 text-blue-800",
      EMPLOYEE: "bg-green-100 text-green-800",
    };
    return colors[cargo as keyof typeof colors] || "bg-gray-100 text-gray-800";
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-80 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="rounded-md border">
          <div className="h-96 bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cargoFilter} onValueChange={setCargoFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos cargos</SelectItem>
              {Object.keys(roleUser).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>
            {employees.length} de {employees.length} funcionários
          </span>
        </div>
        {(statusFilter !== "all" || cargoFilter !== "all" || searchTerm) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setCargoFilter("all");
              onSearchChange("");
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("nome")}
                >
                  Nome
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("email")}
                >
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("cargo")}
                >
                  Cargo
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("dataContratacao")}
                >
                  Contratação
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">
                Último Login
              </TableHead>
              <TableHead className="text-right w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <h3 className="font-semibold">
                      Nenhum funcionário encontrado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      cargoFilter !== "all"
                        ? "Tente ajustar os filtros de busca"
                        : "Adicione funcionários para começar"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id} className="group">
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={employee.photoUrl || "/placeholder.svg"}
                        alt={employee.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground lg:hidden flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {employee.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getCargoColor(employee.role)}
                    >
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(employee.active.toString())}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          employee.active === true
                            ? "bg-green-600"
                            : "bg-gray-400"
                        }`}
                      />
                      {employee.active === true ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(employee.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {employee.lastLogin
                        ? formatRelativeTime(employee.lastLogin)
                        : "Nunca"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setEditingEmployee(employee)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Editar funcionário
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingEmployee(employee)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir funcionário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      {editingEmployee && (
        <EditEmployeeDialog
          employee={editingEmployee}
          open={!!editingEmployee}
          onOpenChange={(open) => {
            if (!open) setEditingEmployee(null);
          }}
        />
      )}

      {deletingEmployee && (
        <DeleteEmployeeDialog
          employee={deletingEmployee}
          open={!!deletingEmployee}
          onOpenChange={(open) => {
            if (!open) setDeletingEmployee(null);
          }}
          onConfirm={() => {
            onDelete(deletingEmployee.id);
            setDeletingEmployee(null);
          }}
        />
      )}
    </div>
  );
}
