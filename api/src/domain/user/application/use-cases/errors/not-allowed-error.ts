import { UseCaseError } from "@/core/errors/use-case-error";

export class NotAllowedError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "Not allowed to perform this action.";
  }
}
