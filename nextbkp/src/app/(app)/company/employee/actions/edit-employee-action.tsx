"use server";

import { AxiosError } from "axios";
import {
  editEmployeeSchema,
  type EditEmployeeFormData,
} from "../lib/edit-validations";
import { editUser } from "@/http/edit-user";
import { deleteFile } from "@/http/delete-file";
import { uploadFile } from "@/http/upload-file";

interface AddEmployeeActionResult {
  success: boolean;
  message?: string;
}

export async function editEmployeeAction(
  id: string,
  data: EditEmployeeFormData,
  oldPhotoId: string | null
): Promise<AddEmployeeActionResult> {
  try {
    const validatedData = editEmployeeSchema.parse(data);

    let responseUploadFile = null;
    if (oldPhotoId) {
      await deleteFile({ id: oldPhotoId });
    }

    if (validatedData.photo) {
      responseUploadFile = await uploadFile({ file: validatedData.photo });
    }

    await editUser({
      id: id,
      name: validatedData.name,
      role: validatedData.role,
      active: validatedData.active,
      photoId: responseUploadFile?.attachmentId || null,
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
