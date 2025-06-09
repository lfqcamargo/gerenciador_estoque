import {
  Controller,
  Param,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  Body,
  ConflictException,
  Post,
} from "@nestjs/common";

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { ConfirmationCreateUserUseCase } from "@/domain/user/application/use-cases/confirmation-create-user";
import { ResourceTokenNotFoundError } from "@/domain/user/application/use-cases/errors/resource-token-not-found-error";
import { AlreadyExistsCnpjError } from "@/domain/user/application/use-cases/errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "@/domain/user/application/use-cases/errors/already-exists-email-error";
import { Public } from "@/infra/auth/public";

const confirmationCreateUserParamsSchema = z.object({
  token: z
    .string({
      required_error: "Token is required",
      invalid_type_error: "Token must be a string",
    })
    .transform((token) => token.trim()),
});

const confirmationCreateUserBodySchema = z.object({
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
});

type ConfirmationCreateUserParams = z.infer<
  typeof confirmationCreateUserParamsSchema
>;

type ConfirmationCreateUserBody = z.infer<
  typeof confirmationCreateUserBodySchema
>;

const paramsValidationPipe = new ZodValidationPipe(
  confirmationCreateUserParamsSchema
);

const bodyValidationPipe = new ZodValidationPipe(
  confirmationCreateUserBodySchema
);

@Controller("users/confirmation/:token")
@Public()
export class ConfirmationCreateUserController {
  constructor(
    private confirmationCreateUserUseCase: ConfirmationCreateUserUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param(paramsValidationPipe) params: ConfirmationCreateUserParams,
    @Body(bodyValidationPipe) body: ConfirmationCreateUserBody
  ) {
    const { token } = params;
    const { password } = body;

    const result = await this.confirmationCreateUserUseCase.execute({
      token,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceTokenNotFoundError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof AlreadyExistsEmailError) {
        throw new ConflictException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }

    return {
      email: result.value.user.email,
    };
  }
}
