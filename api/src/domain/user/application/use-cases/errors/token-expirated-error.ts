import { UseCaseError } from "@/core/errors/use-case-error";

export class TokenExpiratedError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "Token expired.";
  }
}
