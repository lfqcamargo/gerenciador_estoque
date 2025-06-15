import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsGroupError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "A group with this name already exists.";
  }
}
