"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";

export function EmailSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Servidor SMTP</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">Servidor SMTP</Label>
            <Input id="smtpHost" placeholder="smtp.gmail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">Porta</Label>
            <Input id="smtpPort" type="number" defaultValue="587" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpUser">Usuário</Label>
            <Input
              id="smtpUser"
              type="email"
              placeholder="seu-email@gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">Senha</Label>
            <Input id="smtpPassword" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="smtpTls" defaultChecked />
          <Label htmlFor="smtpTls">Usar TLS/SSL</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Configurações de Envio</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emailRemetente">Email do remetente</Label>
            <Input
              id="emailRemetente"
              type="email"
              defaultValue="noreply@stockmanager.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomeRemetente">Nome do remetente</Label>
            <Input id="nomeRemetente" defaultValue="StockManager" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline">
          <TestTube className="mr-2 h-4 w-4" />
          Testar Configuração
        </Button>
      </div>
    </div>
  );
}
