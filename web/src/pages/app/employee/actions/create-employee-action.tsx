import { AxiosError } from "axios";
import {
  addEmployeeSchema,
  type AddEmployeeFormData,
} from "../lib/add-validations";
import { createUser } from "@/api/create-user";

interface AddEmployeeActionResult {
  success: boolean;
  message?: string;
}

export async function createEmployeeAction(
  data: AddEmployeeFormData
): Promise<AddEmployeeActionResult> {
  try {
    const validatedData = addEmployeeSchema.parse(data);

    await createUser({
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
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
