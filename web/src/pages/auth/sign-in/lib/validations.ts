import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({
      required_error: "Email é obrigatório",
    })
    .email("Formato de email inválido")
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string({
      required_error: "Senha é obrigatória",
    })
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormData = z.infer<typeof signInSchema>;
