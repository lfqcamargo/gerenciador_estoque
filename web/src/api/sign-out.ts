import { api } from "@/lib/axios";

export async function signOut() {
  await api.get("/users/logout");
}
