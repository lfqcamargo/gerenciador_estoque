import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsRowError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "A row with this name already exists.";
  }
}
