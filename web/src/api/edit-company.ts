import { api } from "@/lib/axios";

interface EditCompanyRequest {
  name: string;
  lealName: string | null;
  photoId: string | null;
}

type EditCompanyResponse = void;

export async function editCompany(
  data: EditCompanyRequest
): Promise<EditCompanyResponse> {
  await api.put("/companies", data);
}
