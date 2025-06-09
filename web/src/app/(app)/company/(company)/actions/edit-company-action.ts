"use server";

import { editCompany } from "@/http/edit-company";
import { editCompanySchema, EditCompanyFormData } from "../lib/validations";
import { AxiosError } from "axios";
import { uploadFile } from "@/http/upload-file";
import { deleteFile } from "@/http/delete-file";

interface EditCompanyActionResult {
  success: boolean;
  message?: string;
}

export async function editCompanyAction(
  data: EditCompanyFormData,
  oldPhotoId: string | null
): Promise<EditCompanyActionResult> {
  try {
    const validatedData = editCompanySchema.parse(data);

    let responseUploadFile = null;
    if (oldPhotoId) {
      await deleteFile({ id: oldPhotoId });
    }

    if (validatedData.photo) {
      responseUploadFile = await uploadFile({ file: validatedData.photo });
    }

    await editCompany({
      name: validatedData.name,
      lealName: validatedData.lealName || "",
      photoId: responseUploadFile?.attachmentId || "",
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

      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Usuário não é administrador da empresa",
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
