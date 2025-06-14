import { api } from "@/lib/axios";

interface ResetPasswordRequest {
  token: string;
  password: string;
}

type ResetPasswordResponse = void;

export async function resetPassword({
  token,
  password,
}: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  await api.post(`/users/password/reset/${token}`, {
    password,
  });
}
