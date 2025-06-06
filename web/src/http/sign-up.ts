import api from "./api-client";

interface SignUpRequest {
  cnpj: string;
  companyName: string;
  email: string;
  userName: string;
  password: string;
}

type SignUpResponse = void;

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  await api.post("/companies", data);
};
