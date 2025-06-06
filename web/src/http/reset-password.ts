import api from "./api-client";

interface ResetPasswordResponse {
  message: string;
}

export const resetPassword = async (
  token: string,
  password: string
): Promise<ResetPasswordResponse> => {
  const response = await api.post(`/users/password/reset/${token}`, {
    password,
  });
  return response.data;
};
