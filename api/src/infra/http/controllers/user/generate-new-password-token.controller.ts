import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  NotFoundException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { GenerateNewPasswordTokenUseCase } from "@/domain/user/application/use-cases/generate-new-password-token";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { GenerateNewPasswordTokenDocs } from "./swagger/generate-new-password-token.swagger";

const generateNewPasswordTokenBodySchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be at most 255 characters")
    .transform((email) => email.toLowerCase().trim()),
});

type GenerateNewPasswordTokenBody = z.infer<
  typeof generateNewPasswordTokenBodySchema
>;

@Controller("password/forgot")
export class GenerateNewPasswordTokenController {
  constructor(
    private generateNewPasswordTokenUseCase: GenerateNewPasswordTokenUseCase
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(generateNewPasswordTokenBodySchema))
  @GenerateNewPasswordTokenDocs()
  async create(@Body() body: GenerateNewPasswordTokenBody) {
    const { email } = body;

    const result = await this.generateNewPasswordTokenUseCase.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new NotFoundException("Unexpected error");
    }

    const { token, expiration } = result.value;

    return {
      token,
      expiration,
      message: "Password reset token generated successfully",
    };
  }
}
