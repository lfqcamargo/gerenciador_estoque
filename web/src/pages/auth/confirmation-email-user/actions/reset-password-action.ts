import { AxiosError } from "axios";
import {
  resetPasswordSchema,
  type ResetPasswordActionData,
} from "../lib/validations";
import { confirmationEmailUser } from "@/api/confirmation-email-user";

interface ResetPasswordActionResult {
  success: boolean;
  message?: string;
}

export async function resetPasswordAction(
  data: ResetPasswordActionData
): Promise<ResetPasswordActionResult> {
  try {
    const validatedPassword = resetPasswordSchema.parse({
      password: data.password,
      confirmPassword: data.password,
    });

    await confirmationEmailUser({
      token: data.token,
      password: validatedPassword.password,
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message === "Validation failed") {
        return {
          success: false,
          message:
            "Erro de validação, verifique os campos preenchidos e tente novamente",
        };
      }

      if (error.response?.status === 409) {
        if (error.response.data?.message === "Email already exists") {
          return {
            success: false,
            message: "Email já cadastrado",
          };
        }
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          message: "Token de redefinição expirado ou inválido",
        };
      }

      return {
        success: false,
        message: error.response?.data?.message?.message,
      };
    }

    return {
      success: false,
      message: "Erro ao redefinir senha. Tente novamente.",
    };
  }
}
