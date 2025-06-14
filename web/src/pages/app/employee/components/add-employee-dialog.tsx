import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addEmployeeSchema,
  type AddEmployeeFormData,
} from "../lib/add-validations";

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
import { User, Mail, Briefcase } from "lucide-react";
import { createEmployeeAction } from "../actions/create-employee-action";
import { toast } from "sonner";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
}: AddEmployeeDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "EMPLOYEE",
    },
  });

  const handleAddEmployee = async (data: AddEmployeeFormData) => {
    try {
      const response = await createEmployeeAction(data);
      if (response.success) {
        reset();
        onOpenChange(false);
        toast.success("Funcionário cadastrado verifique a caixa de email");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Erro ao cadastrar funcionário");
      console.error("Erro ao adicionar funcionário:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <form onSubmit={handleSubmit(handleAddEmployee)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Adicionar Funcionário
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados do novo funcionário para adicionar ao sistema
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-6">
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

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@empresa.com"
                className="h-11"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Cargo
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
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
                )}
              />
              {errors.role && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  {errors.role.message}
                </p>
              )}
            </div>
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
                    Adicionando...
                  </div>
                ) : (
                  "Adicionar Funcionário"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
