import { cookies } from "next/headers";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return !!token;
}

export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    return token?.value || null;
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
}
