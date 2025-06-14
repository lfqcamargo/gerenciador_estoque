"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editEmployeeSchema,
  type EditEmployeeFormData,
} from "../lib/edit-validations";
import { useState } from "react";
import { User, Mail, Briefcase, Shield, Send, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { EmployeePhotoUpload } from "./employee-photo-upload";
import { editEmployeeAction } from "../actions/edit-employee-action";
import { toast } from "sonner";

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

interface EditEmployeeDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: EditEmployeeDialogProps) {
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: employee.name,
      role: employee.role as "ADMIN" | "MANAGER" | "EMPLOYEE",
      active: employee.active,
      photo: null,
    },
  });

  const handleEditEmployee = async (data: EditEmployeeFormData) => {
    try {
      if (photoFile) {
        data.photo = photoFile;
      }
      const result = await editEmployeeAction(
        employee.id,
        data,
        employee.photoId || null
      );
      if (result.success) {
        toast.success("Funcionário atualizado com sucesso");
        reset();
        setPhotoFile(null);
        onOpenChange(false);
      } else {
        toast.error(result.message || "Erro ao editar funcionário");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao editar funcionário:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setPhotoFile(null);
    onOpenChange(false);
  };

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
      <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleEditEmployee)}>
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
            {/* Card de Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                <CardDescription>Dados básicos do funcionário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Nome Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        placeholder="Digite o nome completo"
                        className="h-11"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          {errors.name.message}
                        </p>
                      )}
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
                              <p>
                                O email não pode ser alterado após a criação
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="email"
                          type="email"
                          className="h-11 bg-muted/50 text-muted-foreground flex-1"
                          value={employee.email}
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
                              Redefinir Senha
                            </>
                          )}
                        </Button>
                      </div>
                      {passwordResetSent && (
                        <Alert
                          variant="default"
                          className="bg-green-50 text-green-800 border-green-200"
                        >
                          <AlertDescription className="text-xs flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Email de redefinição de senha enviado com sucesso!
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Data de Criação */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="createdAt"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Data de Criação
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
                        id="createdAt"
                        type="date"
                        className="h-11 bg-muted/50 text-muted-foreground"
                        value={employee.createdAt.split("T")[0]}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Foto de Perfil */}
                  <div className="flex-1 flex flex-col items-center justify-start">
                    <Label className="mb-4 text-sm font-medium">
                      Foto de Perfil
                    </Label>
                    <EmployeePhotoUpload
                      urlPhoto={employee.photoUrl || null}
                      name={employee.name}
                      onPhotoChange={(file) => setPhotoFile(file)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Configurações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
                <CardDescription>Cargo e status do funcionário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cargo Field */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Cargo
                    </Label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione um cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="ADMIN"
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Administrador
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="MANAGER"
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Gerente
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="EMPLOYEE"
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Funcionário
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  {/* Status Field */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Status
                    </Label>
                    <Controller
                      name="active"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  field.value ? "bg-green-500" : "bg-gray-400"
                                }`}
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {field.value
                                    ? "Funcionário Ativo"
                                    : "Funcionário Inativo"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {field.value
                                    ? "Pode acessar o sistema normalmente"
                                    : "Acesso ao sistema bloqueado"}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 mt-6">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
