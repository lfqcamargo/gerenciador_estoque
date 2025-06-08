import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { GetProfileCompanyUseCase } from "@/domain/user/application/use-cases/get-profile-company";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CompanyPresenter } from "@/infra/http/presenters/company-presenter";

@Controller("companies/me")
export class GetProfileCompanyController {
  constructor(private getProfileCompanyUseCase: GetProfileCompanyUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const { companyId, userId } = user;

    const result = await this.getProfileCompanyUseCase.execute({
      companyId,
      userAuthenticateId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }

    return CompanyPresenter.toHTTP(result.value.company);
  }
}
