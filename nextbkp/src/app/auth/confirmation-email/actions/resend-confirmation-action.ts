"use server";
import { resendConfirmation } from "@/http/resend-confirmation";
import { AxiosError } from "axios";

interface ResendConfirmationResult {
  success: boolean;
  message?: string;
}

export async function resendConfirmationAction(
  email: string
): Promise<ResendConfirmationResult> {
  try {
    await resendConfirmation(email);

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Resend confirmation action error:", error);

    if (error instanceof AxiosError) {
      if (error.response?.status === 429) {
        return {
          success: false,
          message: "Muitas tentativas. Tente novamente em alguns minutos.",
        };
      }

      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Email não encontrado.",
        };
      }
    }

    return {
      success: false,
      message: "Erro ao reenviar confirmação. Tente novamente.",
    };
  }
}
