import { api } from "@/lib/axios";

interface DeleteUserRequest {
  id: string;
}

type DeleteUserResponse = void;
export async function deleteUser({
  id,
}: DeleteUserRequest): Promise<DeleteUserResponse> {
  await api.delete(`/users/${id}`);
}
