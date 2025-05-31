import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidUserRoleError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "Invalid user role.";
  }
}
