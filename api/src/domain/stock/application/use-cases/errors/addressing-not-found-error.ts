import { UseCaseError } from "@/core/errors/use-case-error";

export class AddressingNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Addressing not found`;
  }
}
