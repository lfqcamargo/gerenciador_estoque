import { api } from "./api-client";

export interface GetProfileCompanyResponse {
  name: string;
  cnpj: string;
}

export async function getProfileCompany(): Promise<GetProfileCompanyResponse> {
  const response = await api.get("/companies/me");
  return response.data;
}
