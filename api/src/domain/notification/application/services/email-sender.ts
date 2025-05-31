import { Email } from "../../enterprise/entities/email";
import { Either, left, right } from "@/core/either";

export interface SendEmailResponse {
  success: boolean;
  error?: string;
}

export abstract class EmailSender {
  abstract sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>>;
}
