import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";
import { AttachmentNotFoundError } from "./errors/attachment-not-found-error";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface DeleteAttachmentRequest {
  attachmentId: string;
  userId: string;
  companyId: string;
}

type DeleteAttachmentResponse = Either<
  | AttachmentNotFoundError
  | CompanyNotFoundError
  | UserNotFoundError
  | UserNotBelongToCompanyError,
  null
>;

@Injectable()
export class DeleteAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository
  ) {}

  async execute({
    attachmentId,
    userId,
    companyId,
  }: DeleteAttachmentRequest): Promise<DeleteAttachmentResponse> {
    const company = await this.companiesRepository.findById(companyId);
    if (!company) {
      return left(new CompanyNotFoundError());
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return left(new UserNotFoundError());
    }

    if (user.companyId.toString() !== companyId) {
      return left(new UserNotBelongToCompanyError());
    }

    const attachment = await this.attachmentsRepository.findById(attachmentId);
    if (!attachment) {
      return left(new AttachmentNotFoundError());
    }

    await this.uploader.delete(attachment.url);
    await this.attachmentsRepository.delete(attachmentId);

    return right(null);
  }
}
