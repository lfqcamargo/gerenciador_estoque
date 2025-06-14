"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Building, Bell, Shield, Database, Mail } from "lucide-react";
import { EmpresaSettings } from "./empresa-settings";
import { NotificacoesSettings } from "./notificacoes-settings";
import { SegurancaSettings } from "./seguranca-settings";
import { BackupSettings } from "./backup-settings";
import { EmailSettings } from "./email-settings";

export function ConfiguracoesContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e da empresa
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Configure os dados básicos da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmpresaSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure alertas e notificações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificacoesSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure o servidor de email para notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configure políticas de segurança e acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SegurancaSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup e Restauração
            </CardTitle>
            <CardDescription>
              Configure backups automáticos e restauração de dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BackupSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
