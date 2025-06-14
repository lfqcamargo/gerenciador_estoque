import { api } from "@/lib/axios";

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  access_token: string;
}

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await api.post("/auth/", data);
  return response.data;
};
