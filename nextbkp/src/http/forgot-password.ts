import { api } from "./api-client";

interface ForgotPasswordRequest {
  email: string;
}

type ForgotPasswordResponse = void;

export async function forgotPassword({
  email,
}: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  await api.get(`/users/forgot-password/${email}`);
}
