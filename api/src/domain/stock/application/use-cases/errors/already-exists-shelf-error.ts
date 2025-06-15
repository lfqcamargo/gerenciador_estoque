import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsShelfError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "A shelf with this name already exists.";
  }
}
