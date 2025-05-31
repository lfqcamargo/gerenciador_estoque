import { Either, left, right } from "@/core/either";
import { Email } from "../../enterprise/entities/email";
import { EmailsRepository } from "../repositories/emails-repository";
import { EmailSender } from "../services/email-sender";

interface SendEmailUseCaseRequest {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

type SendEmailUseCaseResponse = Either<Error, { email: Email }>;

export class SendEmailUseCase {
  constructor(
    private emailsRepository: EmailsRepository,
    private emailSender: EmailSender
  ) {}

  async execute({
    to,
    subject,
    body,
    from,
  }: SendEmailUseCaseRequest): Promise<SendEmailUseCaseResponse> {
    const email = Email.create({ to, subject, body, from });

    const result = await this.emailSender.sendEmail(email);

    if (result.isLeft()) {
      return left(result.value);
    }

    email.markAsSent();

    await this.emailsRepository.create(email);

    return right({ email });
  }
}
