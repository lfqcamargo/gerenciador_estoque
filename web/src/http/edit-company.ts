import { api } from "./api-client";

interface EditCompanyRequest {
  name: string;
  lealName: string | null;
  photo: string | null;
}

type EditCompanyResponse = void;

export async function editCompany(
  data: EditCompanyRequest
): Promise<EditCompanyResponse> {
  await api.put("/companies", data);
}
