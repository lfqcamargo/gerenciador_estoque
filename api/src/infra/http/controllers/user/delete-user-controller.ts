import {
  Controller,
  Delete,
  Param,
  HttpCode,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { DeleteUserUseCase } from "@/domain/user/application/use-cases/delete-user";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";
import { NotAllowedError } from "@/domain/user/application/use-cases/errors/not-allowed-error";

const deleteUserParamsSchema = z.object({
  id: z.string(),
});

type DeleteUserParams = z.infer<typeof deleteUserParamsSchema>;

const paramsValidationPipe = new ZodValidationPipe(deleteUserParamsSchema);

@Controller("users/:id")
export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: DeleteUserParams,
    @CurrentUser() user: UserPayload
  ) {
    const { userId } = user;

    const result = await this.deleteUserUseCase.execute({
      userId: params.id,
      authenticatedUserId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotAdminError) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof UserNotBelongToCompanyError) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof NotAllowedError) {
        throw new ForbiddenException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }
  }
}
