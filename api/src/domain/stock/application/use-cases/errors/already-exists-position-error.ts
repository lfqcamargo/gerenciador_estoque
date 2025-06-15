import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsPositionError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "A position with this name already exists.";
  }
}
