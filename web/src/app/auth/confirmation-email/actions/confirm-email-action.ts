"use server";
import { confirmEmail } from "@/http/confirm-email";
import { AxiosError } from "axios";

interface ConfirmEmailResult {
  success: boolean;
  email?: string;
  error?: "TOKEN_EXPIRED" | "TOKEN_INVALID" | "ALREADY_CONFIRMED" | "UNKNOWN";
}

export async function confirmEmailAction(
  token: string
): Promise<ConfirmEmailResult> {
  try {
    const result = await confirmEmail({ token });

    return {
      success: true,
      email: result.email,
    };
  } catch (error: unknown) {
    console.error("Confirm email action error:", error);

    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorCode = error.response.data?.code;

        if (errorCode === "TOKEN_EXPIRED") {
          return {
            success: false,
            error: "TOKEN_EXPIRED",
            email: error.response.data?.email,
          };
        }

        if (errorCode === "TOKEN_INVALID") {
          return {
            success: false,
            error: "TOKEN_INVALID",
            email: error.response.data?.email,
          };
        }

        if (errorCode === "ALREADY_CONFIRMED") {
          return {
            success: false,
            error: "ALREADY_CONFIRMED",
            email: error.response.data?.email,
          };
        }
      }
    }

    return {
      success: false,
      error: "UNKNOWN",
    };
  }
}
