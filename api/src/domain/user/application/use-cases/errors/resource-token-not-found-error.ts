import { UseCaseError } from "@/core/errors/use-case-error";

export class ResourceTokenNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "Resource token not found.";
  }
}
