import { UseCaseError } from "@/core/errors/use-case-error";

export class RowNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Row not found`;
  }
}
