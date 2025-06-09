import { z } from "zod";

export const addEmployeeSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  departamento: z.string().min(1, "Departamento é obrigatório"),
  status: z.enum(["ativo", "inativo"]),
  dataContratacao: z.string(),
});

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;
