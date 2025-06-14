import { api } from "@/lib/axios";

interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

type CreateUserResponse = void;

export const createUser = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  await api.post("/users", data);
};
