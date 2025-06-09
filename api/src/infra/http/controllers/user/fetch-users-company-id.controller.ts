import {
  Controller,
  HttpCode,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Get,
} from "@nestjs/common";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { Roles } from "@/infra/auth/roles.decorator";
import { FetchUsersCompanyIdUseCase } from "@/domain/user/application/use-cases/fetch-users-company-id";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";
import { UserPresenter } from "../../presenters/user-presenter";

@Controller("users")
export class FetchUsersCompanyIdController {
  constructor(private fetchUsersCompanyIdUseCase: FetchUsersCompanyIdUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles(UserRole.ADMIN)
  async handle(@CurrentUser() user: UserPayload) {
    const { companyId, userId } = user;

    const result = await this.fetchUsersCompanyIdUseCase.execute({
      companyId,
      authenticatedUserId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotBelongToCompanyError) {
        throw new ForbiddenException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }

    return {
      users: result.value.users.map(UserPresenter.toHTTP),
    };
  }
}
