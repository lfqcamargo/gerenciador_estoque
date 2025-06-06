"use server";
import { AxiosError } from "axios";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../lib/validations";
import { forgotPassword } from "@/http/forgot-password";

interface ForgotPasswordActionResult {
  success: boolean;
  message?: string;
}

export async function forgotPasswordAction(
  data: ForgotPasswordFormData
): Promise<ForgotPasswordActionResult> {
  try {
    // Validação no servidor
    const validatedData = forgotPasswordSchema.parse(data);

    // Chamar a API
    await forgotPassword(validatedData.email);

    return { success: true };
  } catch (error: unknown) {
    console.error("Forgot password action error:", error);

    if (error instanceof AxiosError) {
      if (error.response?.status === 429) {
        return {
          success: false,
          message: "Muitas tentativas. Tente novamente em alguns minutos.",
        };
      }

      if (error.response?.status === 404) {
        // Não informamos ao usuário que o email não existe por segurança
        return { success: true };
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || "Dados inválidos",
        };
      }

      // Erro de validação do Zod
      if (error.name === "ZodError") {
        return {
          success: false,
          message: "Email inválido. Verifique e tente novamente.",
        };
      }
    }

    return {
      success: false,
      message: "Erro ao processar solicitação. Tente novamente.",
    };
  }
}
