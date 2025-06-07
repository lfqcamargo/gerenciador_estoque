"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SegurancaSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Políticas de Senha</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minCaracteres">Mínimo de caracteres</Label>
            <Input id="minCaracteres" type="number" defaultValue="8" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validadeSenha">Validade da senha (dias)</Label>
            <Input id="validadeSenha" type="number" defaultValue="90" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exigir caracteres especiais</Label>
              <p className="text-sm text-muted-foreground">
                Senha deve conter pelo menos um caractere especial
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exigir números</Label>
              <p className="text-sm text-muted-foreground">
                Senha deve conter pelo menos um número
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exigir maiúsculas e minúsculas</Label>
              <p className="text-sm text-muted-foreground">
                Senha deve conter letras maiúsculas e minúsculas
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Controle de Acesso</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tentativasLogin">
              Máximo de tentativas de login
            </Label>
            <Input id="tentativasLogin" type="number" defaultValue="5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tempoBloqueio">Tempo de bloqueio (minutos)</Label>
            <Input id="tempoBloqueio" type="number" defaultValue="30" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sessaoTimeout">Timeout de sessão</Label>
          <Select defaultValue="60">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="60">1 hora</SelectItem>
              <SelectItem value="120">2 horas</SelectItem>
              <SelectItem value="480">8 horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Auditoria</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Log de ações</Label>
              <p className="text-sm text-muted-foreground">
                Registrar todas as ações dos usuários
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Log de tentativas de login</Label>
              <p className="text-sm text-muted-foreground">
                Registrar tentativas de login bem-sucedidas e falhadas
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
