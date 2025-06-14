import { api } from "@/lib/axios";

interface ForgotPasswordRequest {
  email: string;
}

type ForgotPasswordResponse = void;

export async function forgotPassword({
  email,
}: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  await api.get(`/users/forgot-password/${email}`);
}
