import { roleUser } from "@/utils/role-user";
import { z } from "zod";

export const addEmployeeSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.nativeEnum(roleUser, {
    errorMap: () => ({ message: "Cargo é obrigatório" }),
  }),
});

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;
