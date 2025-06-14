import { z } from "zod";
import { validateCNPJ } from "@/utils/validate-cnpj";

export const signUpSchema = z
  .object({
    cnpj: z
      .string({
        required_error: "CNPJ é obrigatório",
        invalid_type_error: "CNPJ deve ser uma string",
      })
      .min(14, "CNPJ deve ter 14 caracteres")
      .max(18, "CNPJ inválido")
      .transform((cnpj) => cnpj.replace(/\D/g, "")) // Remove caracteres não numéricos
      .refine((cnpj) => cnpj.length === 14, {
        message: "CNPJ deve ter exatamente 14 dígitos",
      })
      .refine((cnpj) => validateCNPJ(cnpj), {
        message: "CNPJ inválido",
      }),

    companyName: z
      .string({
        required_error: "Nome da empresa é obrigatório",
        invalid_type_error: "Nome da empresa deve ser uma string",
      })
      .min(3, "Nome da empresa deve ter pelo menos 3 caracteres")
      .max(255, "Nome da empresa deve ter no máximo 255 caracteres")
      .transform((name) => name.trim()),

    email: z
      .string({
        required_error: "Email é obrigatório",
        invalid_type_error: "Email deve ser uma string",
      })
      .email("Formato de email inválido")
      .min(5, "Email deve ter pelo menos 5 caracteres")
      .max(255, "Email deve ter no máximo 255 caracteres")
      .transform((email) => email.toLowerCase().trim()),

    userName: z
      .string({
        required_error: "Nome do usuário é obrigatório",
        invalid_type_error: "Nome do usuário deve ser uma string",
      })
      .min(3, "Nome do usuário deve ter pelo menos 3 caracteres")
      .max(255, "Nome do usuário deve ter no máximo 255 caracteres")
      .transform((name) => name.trim()),

    password: z
      .string({
        required_error: "Senha é obrigatória",
        invalid_type_error: "Senha deve ser uma string",
      })
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
      ),

    confirmPassword: z.string({
      required_error: "Confirmação de senha é obrigatória",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
