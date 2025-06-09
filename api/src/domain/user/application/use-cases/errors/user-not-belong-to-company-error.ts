import { UseCaseError } from "@/core/errors/use-case-error";

export class UserNotBelongToCompanyError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "User not belong to company";
  }
}
