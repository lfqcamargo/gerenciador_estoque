import api from "./api-client";

interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  const response = await api.get(`/users/forgot-password/${email}`);
  return response.data;
};
