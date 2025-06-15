import { UseCaseError } from "@/core/errors/use-case-error";

export class PositionNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Posistion not found`;
  }
}
