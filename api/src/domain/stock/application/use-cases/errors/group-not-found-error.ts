import { UseCaseError } from "@/core/errors/use-case-error";

export class GroupNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = `Group not found`;
  }
}
