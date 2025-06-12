import { z } from "zod";

export const editEmployeeSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"], {
    required_error: "Cargo é obrigatório",
  }),
  active: z.boolean(),
  photo: z.instanceof(File).optional().nullable(),
});

export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
