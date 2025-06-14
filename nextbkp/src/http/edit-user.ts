import { api } from "./api-client";

interface EditUserRequest {
  id: string;
  name: string;
  role: string;
  active: boolean;
  photoId: string | null;
}

type EditUserResponse = void;

export async function editUser(
  data: EditUserRequest
): Promise<EditUserResponse> {
  await api.put(`/users/${data.id}`, data);
}
