import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsEmailError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Email already exists`;
  }
}
