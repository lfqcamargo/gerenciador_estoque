import { api } from "@/lib/axios";
import { env } from "../env";

interface GetAttachementRequest {
  id: string;
}

interface GetAttachementResponse {
  id: string;
  url: string;
  userId: string;
}

export async function getAttachement(
  data: GetAttachementRequest
): Promise<GetAttachementResponse | null> {
  try {
    const response = await api.get(`/attachments/${data.id}`);

    return {
      ...response.data,
      url: `${env.NEXT_CLOUD_URL}/${response.data.url}`,
    };
  } catch {
    return null;
  }
}
