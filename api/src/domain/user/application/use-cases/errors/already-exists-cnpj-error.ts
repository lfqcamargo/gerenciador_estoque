import { UseCaseError } from "@/core/errors/use-case-error";

export class AlreadyExistsCnpjError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `CNPJ already exists`;
  }
}
