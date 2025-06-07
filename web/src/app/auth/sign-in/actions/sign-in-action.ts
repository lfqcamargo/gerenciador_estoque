"use server";
import { AxiosError } from "axios";
import { signInSchema, type SignInFormData } from "../lib/validations";
import { signIn } from "@/http/sign-in";
import { cookies } from "next/headers";

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

    const cookieStore = await cookies();
    cookieStore.set("token", result.token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

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
