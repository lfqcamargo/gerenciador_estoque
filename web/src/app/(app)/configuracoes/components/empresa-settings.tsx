"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EmpresaSettings() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
          <Input id="nomeEmpresa" defaultValue="StockManager Pro Ltda" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input id="cnpj" defaultValue="12.345.678/0001-90" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" defaultValue="(11) 99999-9999" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue="contato@stockmanager.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Textarea
          id="endereco"
          defaultValue="Rua das Empresas, 123 - Centro - São Paulo/SP - CEP: 01234-567"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="moeda">Moeda</Label>
          <Input id="moeda" defaultValue="BRL" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Fuso Horário</Label>
          <Input id="timezone" defaultValue="America/Sao_Paulo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="idioma">Idioma</Label>
          <Input id="idioma" defaultValue="pt-BR" />
        </div>
      </div>
    </div>
  );
}
