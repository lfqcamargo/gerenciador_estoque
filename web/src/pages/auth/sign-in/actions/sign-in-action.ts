import { AxiosError } from "axios";
import { signInSchema, type SignInFormData } from "../lib/validations";
import { signIn } from "@/api/sign-in";

interface SignInActionResult {
  success: boolean;
  message?: string;
}

export async function signInAction(
  data: SignInFormData
): Promise<SignInActionResult> {
  try {
    const validatedData = signInSchema.parse(data);

    const result = await signIn({
      email: validatedData.email,
      password: validatedData.password,
    });

    // localStorage.setItem("token", result.access_token);
    document.cookie = `token=${result.access_token}; path=/; max-age=${
      60 * 60 * 24 * 30
    }; SameSite=Lax; ${import.meta.env.PROD ? "Secure;" : ""}`;

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: "Email ou senha incorretos",
      };
    }
    return {
      success: false,
      message: "Erro inesperado. Tente novamente.",
    };
  }
}
