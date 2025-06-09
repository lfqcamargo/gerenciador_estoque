import { Controller, Delete, Param, BadRequestException } from "@nestjs/common";
import { DeleteAttachmentUseCase } from "@/domain/shared/application/use-cases/delete-attachment-by-id";
import { AttachmentNotFoundError } from "@/domain/shared/application/use-cases/errors/attachment-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

@Controller("/attachments")
export class DeleteAttachmentByIdController {
  constructor(private deleteAttachment: DeleteAttachmentUseCase) {}

  @Delete(":attachmentId")
  async handle(
    @Param("attachmentId") attachmentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteAttachment.execute({
      attachmentId,
      companyId: user.companyId,
      userId: user.userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AttachmentNotFoundError:
        case CompanyNotFoundError:
        case UserNotFoundError:
        case UserNotBelongToCompanyError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException("Unexpected error occurred");
      }
    }

    return {
      message: "Attachment deleted successfully",
    };
  }
}
