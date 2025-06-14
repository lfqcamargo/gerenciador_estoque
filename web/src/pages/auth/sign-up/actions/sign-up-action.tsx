import { AxiosError } from "axios";
import { signUpSchema, type SignUpFormData } from "../lib/validations";
import { signUp } from "@/api/sign-up";

interface SignUpActionResult {
  success: boolean;
  message?: string;
}

export async function signUpAction(
  data: SignUpFormData
): Promise<SignUpActionResult> {
  try {
    const validatedData = signUpSchema.parse(data);

    await signUp({
      cnpj: validatedData.cnpj,
      companyName: validatedData.companyName,
      email: validatedData.email,
      userName: validatedData.userName,
      password: validatedData.password,
    });

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

      if (error.response?.status === 409) {
        if (error.response.data?.message === "Email already exists") {
          return {
            success: false,
            message: "Email já cadastrado",
          };
        }

        if (error.response.data?.message === "CNPJ already exists") {
          return {
            success: false,
            message: "CNPJ já cadastrado",
          };
        }
      }

      if (error.response?.status && error.response?.status >= 500) {
        return {
          success: false,
          message: "Erro interno do servidor. Tente novamente mais tarde.",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado. Tente novamente.",
    };
  }
}
