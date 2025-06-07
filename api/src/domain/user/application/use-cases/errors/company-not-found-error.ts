import { UseCaseError } from "@/core/errors/use-case-error";

export class CompanyNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Company not found`;
  }
}
