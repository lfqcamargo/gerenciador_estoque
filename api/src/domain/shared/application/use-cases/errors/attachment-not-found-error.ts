import { UseCaseError } from "@/core/errors/use-case-error";

export class AttachmentNotFoundError implements UseCaseError {
  message: string;

  constructor() {
    this.message = "Attachment not found";
  }
}
