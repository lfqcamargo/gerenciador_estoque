"use server";
import { AxiosError } from "axios";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../lib/validations";
import { forgotPassword } from "@/api/forgot-password";

interface ForgotPasswordActionResult {
  success: boolean;
  message?: string;
}

export async function forgotPasswordAction(
  data: ForgotPasswordFormData
): Promise<ForgotPasswordActionResult> {
  try {
    const validatedData = forgotPasswordSchema.parse(data);

    await forgotPassword({ email: validatedData.email });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message?.name === "ZodValidationError") {
        return {
          success: false,
          message:
            "Erro de validação, verifique os campos preenchidos e tente novamente",
        };
      }

      if (error.response?.status === 404) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        message: error.response?.data?.message,
      };
    }

    return {
      success: false,
      message: "Erro ao processar solicitação. Tente novamente.",
    };
  }
}
