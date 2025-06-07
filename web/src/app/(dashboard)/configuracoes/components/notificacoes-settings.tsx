"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function NotificacoesSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Alertas de Estoque</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Estoque baixo</Label>
              <p className="text-sm text-muted-foreground">
                Notificar quando o estoque estiver abaixo do mínimo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Estoque zerado</Label>
              <p className="text-sm text-muted-foreground">
                Notificar quando o estoque estiver zerado
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Materiais vencidos</Label>
              <p className="text-sm text-muted-foreground">
                Notificar sobre materiais com validade vencida
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Notificações por Email</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Relatórios automáticos</Label>
              <p className="text-sm text-muted-foreground">
                Enviar relatórios semanais por email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailRelatorios">Email para relatórios</Label>
              <Input
                id="emailRelatorios"
                type="email"
                defaultValue="admin@stockmanager.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequencia">Frequência</Label>
              <Input id="frequencia" defaultValue="Semanal" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Configurações Avançadas</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="limiteEstoque">Limite para estoque baixo (%)</Label>
            <Input id="limiteEstoque" type="number" defaultValue="20" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diasVencimento">Dias antes do vencimento</Label>
            <Input id="diasVencimento" type="number" defaultValue="30" />
          </div>
        </div>
      </div>
    </div>
  );
}
