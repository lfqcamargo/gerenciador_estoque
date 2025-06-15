import { Injectable } from "@nestjs/common";
import { AttachmentsRepository } from "./../repositories/attachments-repository";
import { Either, left, right } from "@/core/either";
import { Attachment } from "../../enterprise/entities/attachment";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";
import { AttachmentNotFoundError } from "./errors/attachment-not-found-error";

interface FindByIdUseCaseRequest {
  id: string;
  companyId: string;
}

type FindByIdUseCaseResponse = Either<
  UserNotBelongToCompanyError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class FindByIdUseCase {
  constructor(private readonly attachmentsRepository: AttachmentsRepository) {}

  async execute({
    id,
    companyId,
  }: FindByIdUseCaseRequest): Promise<FindByIdUseCaseResponse> {
    const attachment = await this.attachmentsRepository.findById(id);

    if (!attachment) {
      return left(new AttachmentNotFoundError());
    }

    if (attachment.companyId.toString() !== companyId) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ attachment });
  }
}
