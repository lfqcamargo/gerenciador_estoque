import api from "./api-client";

interface SignInRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignInResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    companyName?: string;
  };
  expiresAt: string;
}

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await api.post("/auth/sign-in", data);
  return response.data;
};
