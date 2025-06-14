import { api } from "@/lib/axios";

interface ConfirmEmailRequest {
  token: string;
}

interface ConfirmEmailResponse {
  email: string;
}

export async function confirmEmail({
  token,
}: ConfirmEmailRequest): Promise<ConfirmEmailResponse> {
  const response = await api.get(`/companies/token/${token}`);

  return response.data;
}
