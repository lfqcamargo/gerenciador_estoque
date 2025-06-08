import { env } from "../env";
import { getCookie } from "cookies-next";
import axios from "axios";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  let token: string | undefined;

  if (typeof window === "undefined") {
    // Servidor - usar cookies do Next.js
    const { cookies: serverCookies } = await import("next/headers");
    const cookieStore = await serverCookies();
    const tokenCookie = cookieStore.get("token");
    token = tokenCookie?.value;
  } else {
    token = getCookie("token") as string;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para capturar erros
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("❌ Erro na API:");
//     console.log("- Status:", error.response?.status);
//     console.log("- URL:", error.config?.url);
//     console.log("- Headers enviados:", error.config?.headers);
//     return Promise.reject(error);
//   }
// );
