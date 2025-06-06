import {
  Controller,
  Param,
  UsePipes,
  HttpCode,
  BadRequestException,
  Get,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { ConfirmationCreateCompanyUseCase } from "@/domain/user/application/use-cases/confirmation-create-company";
import { ResourceTokenNotFoundError } from "@/domain/user/application/use-cases/errors/resource-token-not-found-error";
import { AlreadyExistsCnpjError } from "@/domain/user/application/use-cases/errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "@/domain/user/application/use-cases/errors/already-exists-email-error";
import { Public } from "@/infra/auth/public";

const confirmationCreateCompanyParamsSchema = z.object({
  token: z
    .string({
      required_error: "Token is required",
      invalid_type_error: "Token must be a string",
    })
    .transform((token) => token.trim()),
});

type ConfirmationCreateCompanyParams = z.infer<
  typeof confirmationCreateCompanyParamsSchema
>;
const paramsValidationPipe = new ZodValidationPipe(
  confirmationCreateCompanyParamsSchema
);

@Controller("companies/token/:token")
@Public()
export class ConfirmationCreateCompanyController {
  constructor(
    private confirmationCreateCompanyUseCase: ConfirmationCreateCompanyUseCase
  ) {}

  @Get()
  @HttpCode(201)
  async create(
    @Param(paramsValidationPipe) params: ConfirmationCreateCompanyParams
  ) {
    const { token } = params;

    const result = await this.confirmationCreateCompanyUseCase.execute({
      token,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceTokenNotFoundError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof AlreadyExistsCnpjError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof AlreadyExistsEmailError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException("Unexpected error");
    }

    return {
      email: result.value.user.email,
    };
  }
}
