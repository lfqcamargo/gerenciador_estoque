import { UseCaseError } from "@/core/errors/use-case-error";

export class SubLocationNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Sub location not found`;
  }
}
