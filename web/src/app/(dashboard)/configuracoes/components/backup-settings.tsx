"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload, Database } from "lucide-react";

export function BackupSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Backup Automático</h4>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Ativar backup automático</Label>
            <p className="text-sm text-muted-foreground">
              Realizar backups automáticos do banco de dados
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequenciaBackup">Frequência</Label>
            <Select defaultValue="diario">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="horarioBackup">Horário</Label>
            <Input id="horarioBackup" type="time" defaultValue="02:00" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="retencaoBackup">Retenção de backups (dias)</Label>
          <Input id="retencaoBackup" type="number" defaultValue="30" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Localização do Backup</h4>
        <div className="space-y-2">
          <Label htmlFor="caminhoBackup">Caminho do backup</Label>
          <Input id="caminhoBackup" defaultValue="/var/backups/stockmanager" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Backup na nuvem</Label>
            <p className="text-sm text-muted-foreground">
              Enviar backups para armazenamento em nuvem
            </p>
          </div>
          <Switch />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Ações Manuais</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Database className="mr-2 h-4 w-4" />
            Fazer Backup Agora
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Baixar Último Backup
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Restaurar Backup
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Histórico de Backups</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <div>
              <p className="font-medium">backup_2024-12-06_02-00.sql</p>
              <p className="text-sm text-muted-foreground">
                6 de dezembro de 2024, 02:00 - 2.3 MB
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <div>
              <p className="font-medium">backup_2024-12-05_02-00.sql</p>
              <p className="text-sm text-muted-foreground">
                5 de dezembro de 2024, 02:00 - 2.2 MB
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
