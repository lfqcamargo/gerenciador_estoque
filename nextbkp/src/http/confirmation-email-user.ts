import { api } from "./api-client";

interface ConfirmationEmailUserRequest {
  token: string;
  password: string;
}

type ConfirmationEmailUserResponse = void;

export async function confirmationEmailUser({
  token,
  password,
}: ConfirmationEmailUserRequest): Promise<ConfirmationEmailUserResponse> {
  await api.post(`/users/confirmation/${token}`, {
    password,
  });
}
