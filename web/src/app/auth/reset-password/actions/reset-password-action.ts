"use server";
import { AxiosError } from "axios";
import {
  resetPasswordSchema,
  type ResetPasswordActionData,
} from "../lib/validations";
import { resetPassword } from "@/http/reset-password";

interface ResetPasswordActionResult {
  success: boolean;
  message?: string;
}

export async function resetPasswordAction(
  data: ResetPasswordActionData
): Promise<ResetPasswordActionResult> {
  try {
    // Validação no servidor
    const validatedPassword = resetPasswordSchema.parse({
      password: data.password,
      confirmPassword: data.password, // Já validado no cliente
    });

    // Chamar a API
    await resetPassword(data.token, validatedPassword.password);

    return { success: true };
  } catch (error: unknown) {
    console.error("Reset password action error:", error);

    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorCode = error.response.data?.code;

        if (errorCode === "TOKEN_EXPIRED") {
          return {
            success: false,
            message: "O link de redefinição expirou. Solicite um novo link.",
          };
        }

        if (errorCode === "TOKEN_INVALID") {
          return {
            success: false,
            message: "Link de redefinição inválido. Solicite um novo link.",
          };
        }

        return {
          success: false,
          message: error.response.data?.message || "Dados inválidos",
        };
      }

      // Erro de validação do Zod
      if (error.name === "ZodError") {
        return {
          success: false,
          message: "Senha inválida. Verifique os requisitos e tente novamente.",
        };
      }
    }

    return {
      success: false,
      message: "Erro ao redefinir senha. Tente novamente.",
    };
  }
}
