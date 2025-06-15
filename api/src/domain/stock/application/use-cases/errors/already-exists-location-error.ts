import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsLocationError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "A location with this name already exists.";
  }
}
