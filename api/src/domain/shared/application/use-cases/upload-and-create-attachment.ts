import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface UploadAndCreateAttachmentRequest {
  fileName: string;
  fileType: string;
  body: Buffer;

  companyId: string;
  userId: string;
}

type UploadAndCreateAttachmentResponse = Either<
  | InvalidAttachmentTypeError
  | CompanyNotFoundError
  | UserNotFoundError
  | UserNotBelongToCompanyError,
  { attachment: Attachment }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    fileName,
    fileType,
    body,
    companyId,
    userId,
  }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

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

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
      companyId: new UniqueEntityID(companyId),
      userId: new UniqueEntityID(userId),
    });

    await this.attachmentsRepository.create(attachment);

    return right({
      attachment,
    });
  }
}
