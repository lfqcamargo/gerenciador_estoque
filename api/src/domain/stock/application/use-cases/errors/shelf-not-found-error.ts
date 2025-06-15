import { UseCaseError } from "@/core/errors/use-case-error";

export class ShelfNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Shelf not found`;
  }
}
