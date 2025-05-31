import { UseCaseError } from "@/core/errors/use-case-error";

export class UserNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `User not found`;
  }
}
