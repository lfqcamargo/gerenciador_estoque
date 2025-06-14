import { api } from "@/lib/axios";

interface DeleteFileRequest {
  id: string;
}

type DeleteFileResponse = void;

export async function deleteFile(
  data: DeleteFileRequest
): Promise<DeleteFileResponse> {
  await api.delete(`/attachments/${data.id}`);
}
