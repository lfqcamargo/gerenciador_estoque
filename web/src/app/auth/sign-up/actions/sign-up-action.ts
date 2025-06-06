import { AxiosError } from "axios";
import { signUpSchema, type SignUpFormData } from "../lib/validations";
import { signUp } from "@/http/sign-up";

interface SignUpActionResult {
  success: boolean;
  message?: string;
}

export async function signUpAction(
  data: SignUpFormData
): Promise<SignUpActionResult> {
  try {
    // Validação no servidor
    const validatedData = signUpSchema.parse(data);

    // Chamar a API
    const response = await signUp({
      cnpj: validatedData.cnpj,
      companyName: validatedData.companyName,
      email: validatedData.email,
      userName: validatedData.userName,
      password: validatedData.password,
    });

    console.log(response);
    return { success: true };
  } catch (error: unknown) {
    console.error("Sign up action error:", error);

    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        return {
          success: false,
          message: error.response.data?.message,
        };
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || "Dados inválidos",
        };
      }

      if (error.response?.status && error.response?.status >= 500) {
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
