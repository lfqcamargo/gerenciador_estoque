"use server";
import { AxiosError } from "axios";
import { signInSchema, type SignInFormData } from "../lib/validations";
import { signIn } from "@/http/sign-in";

interface SignInActionResult {
  success: boolean;
  message?: string;
}

export async function signInAction(
  data: SignInFormData
): Promise<SignInActionResult> {
  try {
    // Validação no servidor
    const validatedData = signInSchema.parse(data);

    // Chamar a API
    const result = await signIn({
      email: validatedData.email,
      password: validatedData.password,
      rememberMe: validatedData.rememberMe || false,
    });

    // Aqui você pode armazenar o token/sessão
    // Por exemplo, usando cookies ou localStorage
    console.log("Login successful:", result);

    return { success: true };
  } catch (error: unknown) {
    console.error("Sign in action error:", error);

    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Email ou senha incorretos",
        };
      }

      if (error.response?.status === 403) {
        const errorCode = error.response.data?.code;

        if (errorCode === "EMAIL_NOT_CONFIRMED") {
          return {
            success: false,
            message:
              "Confirme seu email antes de fazer login. Verifique sua caixa de entrada.",
          };
        }

        if (errorCode === "ACCOUNT_SUSPENDED") {
          return {
            success: false,
            message: "Sua conta foi suspensa. Entre em contato com o suporte.",
          };
        }

        return {
          success: false,
          message: "Acesso negado",
        };
      }

      if (error.response?.status === 429) {
        return {
          success: false,
          message:
            "Muitas tentativas de login. Tente novamente em alguns minutos.",
        };
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || "Dados inválidos",
        };
      }

      if (error.response?.status >= 500) {
        return {
          success: false,
          message: "Erro interno do servidor. Tente novamente mais tarde.",
        };
      }

      // Erro de validação do Zod
      if (error.name === "ZodError") {
        return {
          success: false,
          message: "Dados inválidos. Verifique os campos e tente novamente.",
        };
      }
    }
    return {
      success: false,
      message: "Erro inesperado. Tente novamente.",
    };
  }
}
