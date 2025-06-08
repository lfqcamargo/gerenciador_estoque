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
import { MoreHorizontal, Edit, Trash2, Shield, ShieldOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dados mockados
const usuarios = [
  {
    id: "1",
    nome: "Lucas Fernando",
    email: "lucas@stockmanager.com",
    perfil: "Administrador",
    status: "ativo",
    ultimoAcesso: "2024-12-06T10:30:00",
    dataCriacao: "2024-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    nome: "João Silva",
    email: "joao@stockmanager.com",
    perfil: "Operador",
    status: "ativo",
    ultimoAcesso: "2024-12-06T09:15:00",
    dataCriacao: "2024-02-01",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    nome: "Maria Santos",
    email: "maria@stockmanager.com",
    perfil: "Supervisor",
    status: "ativo",
    ultimoAcesso: "2024-12-05T16:45:00",
    dataCriacao: "2024-02-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    nome: "Pedro Costa",
    email: "pedro@stockmanager.com",
    perfil: "Operador",
    status: "inativo",
    ultimoAcesso: "2024-11-28T14:20:00",
    dataCriacao: "2024-03-01",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    nome: "Ana Lima",
    email: "ana@stockmanager.com",
    perfil: "Visualizador",
    status: "ativo",
    ultimoAcesso: "2024-12-06T08:30:00",
    dataCriacao: "2024-03-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

interface UsuariosTableProps {
  searchTerm: string;
}

export function UsuariosTable({ searchTerm }: UsuariosTableProps) {
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.perfil.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getPerfilBadge = (perfil: string) => {
    switch (perfil) {
      case "Administrador":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            <Shield className="mr-1 h-3 w-3" />
            Administrador
          </Badge>
        );
      case "Supervisor":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Supervisor
          </Badge>
        );
      case "Operador":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Operador
          </Badge>
        );
      case "Visualizador":
        return <Badge variant="secondary">Visualizador</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Último Acesso</TableHead>
          <TableHead>Data Criação</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsuarios.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={usuario.avatar || "/placeholder.svg"}
                    alt={usuario.nome}
                  />
                  <AvatarFallback>
                    {usuario.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{usuario.nome}</span>
              </div>
            </TableCell>
            <TableCell>{usuario.email}</TableCell>
            <TableCell>{getPerfilBadge(usuario.perfil)}</TableCell>
            <TableCell>{getStatusBadge(usuario.status)}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm">
                  {new Date(usuario.ultimoAcesso).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(usuario.ultimoAcesso).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {new Date(usuario.dataCriacao).toLocaleDateString("pt-BR")}
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
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {usuario.status === "ativo" ? (
                      <>
                        <ShieldOff className="mr-2 h-4 w-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Ativar
                      </>
                    )}
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
