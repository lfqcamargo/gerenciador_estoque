import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "Senha é obrigatória",
      })
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
      ),
    confirmPassword: z.string({
      required_error: "Confirmação de senha é obrigatória",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export interface ResetPasswordActionData {
  token: string;
  password: string;
}

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
