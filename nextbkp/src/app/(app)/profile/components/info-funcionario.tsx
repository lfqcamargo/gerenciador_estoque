"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, CreditCard, UserCheck } from "lucide-react";

interface Funcionario {
  email: string;
  cargo: string;
  departamento: string;
  status: string;
  dataContratacao: string;
  telefone?: string;
  cpf?: string;
  supervisor?: string;
}

interface InfoFuncionarioProps {
  funcionario: Funcionario;
}

export function InfoFuncionario({ funcionario }: InfoFuncionarioProps) {
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function calcularTempoEmpresa(dataContratacao: string) {
    const inicio = new Date(dataContratacao);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const anos = Math.floor(diffDays / 365);
    const meses = Math.floor((diffDays % 365) / 30);

    if (anos > 0) {
      return `${anos} ano${anos > 1 ? "s" : ""} e ${meses} mês${
        meses !== 1 ? "es" : ""
      }`;
    }
    return `${meses} mês${meses !== 1 ? "es" : ""}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Informações</CardTitle>
        <CardDescription>Dados do seu perfil profissional</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    funcionario.status === "ativo" ? "default" : "secondary"
                  }
                >
                  {funcionario.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-sm">{funcionario.email}</p>
            </div>
          </div>

          {funcionario.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Telefone
                </label>
                <p className="text-sm">{funcionario.telefone}</p>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Cargo
            </label>
            <p className="text-sm font-medium">{funcionario.cargo}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Departamento
            </label>
            <p className="text-sm">{funcionario.departamento}</p>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Data de Contratação
              </label>
              <p className="text-sm">
                {formatDate(funcionario.dataContratacao)}
              </p>
              <p className="text-xs text-muted-foreground">
                Tempo na empresa:{" "}
                {calcularTempoEmpresa(funcionario.dataContratacao)}
              </p>
            </div>
          </div>

          {funcionario.supervisor && (
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Supervisor
                </label>
                <p className="text-sm">{funcionario.supervisor}</p>
              </div>
            </div>
          )}

          {funcionario.cpf && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  CPF
                </label>
                <p className="text-sm">{funcionario.cpf}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
