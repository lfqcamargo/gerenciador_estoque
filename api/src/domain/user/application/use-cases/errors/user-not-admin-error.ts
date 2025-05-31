import { UseCaseError } from "@/core/errors/use-case-error";

export class UserNotAdminError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "User is not admin.";
  }
}
