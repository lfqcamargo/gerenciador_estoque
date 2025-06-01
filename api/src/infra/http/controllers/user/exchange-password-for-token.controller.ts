import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  BadRequestException,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { ExchangePasswordForTokenUseCase } from "@/domain/user/application/use-cases/exchange-password-for-token";
import { ResourceTokenNotFoundError } from "@/domain/user/application/use-cases/errors/resource-token-not-found-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { TokenExpiratedError } from "@/domain/user/application/use-cases/errors/token-expirated-error";
import { Public } from "@/infra/auth/public";

const exchangePasswordForTokenParamsSchema = z.object({
  token: z
    .string({
      required_error: "Token is required",
      invalid_type_error: "Token must be a string",
    })
    .transform((token) => token.trim()),
});

const exchangePasswordForTokenBodySchema = z.object({
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

type ExchangePasswordForTokenBody = z.infer<
  typeof exchangePasswordForTokenBodySchema
>;
type ExchangePasswordForTokenParams = z.infer<
  typeof exchangePasswordForTokenParamsSchema
>;

const paramsValidationPipe = new ZodValidationPipe(
  exchangePasswordForTokenParamsSchema
);
const bodyValidationPipe = new ZodValidationPipe(
  exchangePasswordForTokenBodySchema
);

@Controller("users/password/reset/:token")
@Public()
export class ExchangePasswordForTokenController {
  constructor(
    private exchangePasswordForTokenUseCase: ExchangePasswordForTokenUseCase
  ) {}

  @Post()
  @HttpCode(204)
  async create(
    @Param(paramsValidationPipe) params: ExchangePasswordForTokenParams,
    @Body(bodyValidationPipe) body: ExchangePasswordForTokenBody
  ) {
    const { token } = params;
    const { password } = body;

    const result = await this.exchangePasswordForTokenUseCase.execute({
      token,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceTokenNotFoundError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof TokenExpiratedError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException("Unexpected error");
    }
  }
}
