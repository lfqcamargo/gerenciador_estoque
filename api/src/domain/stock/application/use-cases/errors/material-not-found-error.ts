import { UseCaseError } from "@/core/errors/use-case-error";

export class MaterialNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Material not found`;
  }
}
