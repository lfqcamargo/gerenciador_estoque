import { AxiosError } from "axios";
import { deleteUser } from "@/api/delete-user";

interface DeleteEmployeeActionResult {
  success: boolean;
  message?: string;
}

export async function deleteEmployeeAction(
  id: string
): Promise<DeleteEmployeeActionResult> {
  try {
    await deleteUser({ id });

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

      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Funcionário não encontrado",
        };
      }

      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Você não tem permissão para deletar este funcionário",
        };
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
