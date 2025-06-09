"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Employee {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  status: string;
  dataContratacao: string;
}

interface EditEmployeeDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Employee>) => void;
}

export function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
  onSave,
}: EditEmployeeDialogProps) {
  const [formData, setFormData] = useState<Employee>({
    id: "",
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
    status: "",
    dataContratacao: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setPasswordResetSent(false);
    }
  }, [employee]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleStatusChange(checked: boolean) {
    setFormData((prev) => ({ ...prev, status: checked ? "ativo" : "inativo" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendPasswordReset() {
    setPasswordResetLoading(true);
    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPasswordResetSent(true);
    } finally {
      setPasswordResetLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Editar Funcionário
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Atualize os dados do funcionário no sistema
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-6">
            {/* Nome Field */}
            <div className="space-y-2">
              <Label
                htmlFor="nome"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Digite o nome completo"
                className="h-11"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field - Somente leitura */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Somente leitura
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>O email não pode ser alterado após a criação</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex gap-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="h-11 bg-muted/50 text-muted-foreground flex-1"
                  value={formData.email}
                  disabled
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 gap-2"
                  onClick={handleSendPasswordReset}
                  disabled={passwordResetLoading || passwordResetSent}
                >
                  {passwordResetLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : passwordResetSent ? (
                    <>
                      <Shield className="h-4 w-4 text-green-500" />
                      Enviado
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar redefinição
                    </>
                  )}
                </Button>
              </div>
              {passwordResetSent && (
                <Alert
                  variant="success"
                  className="bg-green-50 text-green-800 border-green-200"
                >
                  <AlertDescription className="text-xs flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Email de redefinição de senha enviado com sucesso!
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Cargo e Departamento */}
            <div className="w-full">
              <div className="space-y-2">
                <Label
                  htmlFor="cargo"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Cargo
                </Label>
                <Select
                  value={formData.cargo}
                  onValueChange={(value) => handleSelectChange("cargo", value)}
                >
                  <SelectTrigger id="cargo" className="h-11 w-full">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Administrador
                      </div>
                    </SelectItem>
                    <SelectItem value="MANAGER" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Gerente
                      </div>
                    </SelectItem>
                    <SelectItem value="EMPLOYEE" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Funcionário
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status e Data de Contratação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Status
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.status === "ativo"}
                      onCheckedChange={handleStatusChange}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span
                      className={`text-sm ${
                        formData.status === "ativo"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </Label>
                <div
                  className={`h-11 rounded-md border flex items-center px-4 ${
                    formData.status === "ativo"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      formData.status === "ativo"
                        ? "bg-green-600"
                        : "bg-gray-400"
                    }`}
                  />
                  {formData.status === "ativo"
                    ? "Funcionário ativo no sistema"
                    : "Funcionário inativo no sistema"}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dataContratacao"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Criação
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          Somente leitura
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Data de criação do funcionário</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>

                <Input
                  id="dataContratacao"
                  name="dataContratacao"
                  type="date"
                  className="h-11"
                  value={formData.dataContratacao.split("T")[0]}
                  readOnly
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 mt-6">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </div>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
