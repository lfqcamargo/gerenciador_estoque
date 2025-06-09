import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ForbiddenException,
} from "@nestjs/common";

import { FindByIdUseCase } from "@/domain/shared/application/use-cases/find-by-id";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { AttachmentPresenter } from "@/infra/http/presenters/attachment-presenter";
import { AttachmentNotFoundError } from "@/domain/shared/application/use-cases/errors/attachment-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

@Controller("attachments/:id")
export class FindAttachmentByIdController {
  constructor(private findAttachmentByIdUseCase: FindByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload, @Param("id") id: string) {
    const result = await this.findAttachmentByIdUseCase.execute({
      id,
      companyId: user.companyId,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof AttachmentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotBelongToCompanyError) {
        throw new ForbiddenException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }

    return AttachmentPresenter.toHTTP(result.value.attachment);
  }
}
