import { UseCaseError } from "@/core/errors/use-case-error";

export class LocationNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Location not found`;
  }
}
