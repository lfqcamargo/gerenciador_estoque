import { z } from "zod";

export const editCompanySchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório",
    })
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  cnpj: z.string().readonly(),
  lealName: z
    .string({
      required_error: "Razão Social é obrigatória",
    })
    .optional()
    .nullable(),
  photo: z.instanceof(File).optional().nullable(),
});

export type EditCompanyFormData = z.infer<typeof editCompanySchema>;
