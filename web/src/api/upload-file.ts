import { api } from "@/lib/axios";

interface UploadFileRequest {
  file: File;
}

interface UploadFileResponse {
  attachmentId: string;
}

export async function uploadFile(
  data: UploadFileRequest
): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await api.post("/attachments", formData);

  return response.data;
}
