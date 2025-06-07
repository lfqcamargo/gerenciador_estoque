"use server";
import { confirmEmail } from "@/http/confirm-email";
import { AxiosError } from "axios";

interface ConfirmEmailResult {
  success: boolean;
  message?: string;
}

export async function confirmEmailAction(
  token: string
): Promise<ConfirmEmailResult> {
  try {
    await confirmEmail({ token });

    return {
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message?.name === "ZodValidationError") {
        return {
          success: false,
          message: "Erro de validação, verifique o token e tente novamente",
        };
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          message: "Token inválido",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado. Tente novamente.",
    };
  }
}
