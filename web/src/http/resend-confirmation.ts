import api from "./api-client";

interface ResendConfirmationResponse {
  message: string;
}

export const resendConfirmation = async (
  email: string
): Promise<ResendConfirmationResponse> => {
  const response = await api.post("/auth/resend-confirmation", { email });
  return response.data;
};
