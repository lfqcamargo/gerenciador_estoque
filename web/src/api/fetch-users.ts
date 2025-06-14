import { api } from "@/lib/axios";

export interface FetchUsersResponse {
  users: [
    {
      companyId: string;
      id: string;
      name: string;
      email: string;
      photoId: string | null;
      role: string;
      active: boolean;
      createdAt: string;
      lastLogin: string | null;
    }
  ];
}

export async function fetchUsers(): Promise<FetchUsersResponse> {
  const response = await api.get("/users");

  return response.data;
}
