import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPresenter } from "@/infra/http/presenters/user-presenter";
import { GetProfileUserUseCase } from "@/domain/user/application/use-cases/get-profile-user";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("users/me")
export class GetProfileUserController {
  constructor(private getProfileUserUseCase: GetProfileUserUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const { userId } = user;

    const result = await this.getProfileUserUseCase.execute({
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }

    return UserPresenter.toHTTP(result.value.user);
  }
}
