import { api } from "@/lib/axios";

export interface GetProfileUserResponse {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export async function getProfileUser(): Promise<GetProfileUserResponse> {
  const response = await api.get("/users/me");
  return response.data;
}
