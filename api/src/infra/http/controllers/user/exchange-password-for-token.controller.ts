import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { ExchangePasswordForTokenUseCase } from "@/domain/user/application/use-cases/exchange-password-for-token";
import { ResourceTokenNotFoundError } from "@/domain/user/application/use-cases/errors/resource-token-not-found-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { TokenExpiratedError } from "@/domain/user/application/use-cases/errors/token-expirated-error";

const exchangePasswordForTokenBodySchema = z.object({
  token: z
    .string({
      required_error: "Token is required",
      invalid_type_error: "Token must be a string",
    })
    .uuid("Invalid token format")
    .transform((token) => token.trim()),
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

@Controller("password/reset")
export class ExchangePasswordForTokenController {
  constructor(
    private exchangePasswordForTokenUseCase: ExchangePasswordForTokenUseCase
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(exchangePasswordForTokenBodySchema))
  async create(@Body() body: ExchangePasswordForTokenBody) {
    const { token, password } = body;

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

    return { message: "Password changed successfully" };
  }
}
