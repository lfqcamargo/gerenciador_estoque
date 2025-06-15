import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsMaterialError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "A material with this name already exists.";
  }
}
