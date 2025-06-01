import {
  Controller,
  UsePipes,
  HttpCode,
  NotFoundException,
  Get,
  Param,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { GenerateNewPasswordTokenUseCase } from "@/domain/user/application/use-cases/generate-new-password-token";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { Public } from "@/infra/auth/public";

const generateNewPasswordTokenParamsSchema = z.object({
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

type GenerateNewPasswordTokenParams = z.infer<
  typeof generateNewPasswordTokenParamsSchema
>;
const paramsValidationPipe = new ZodValidationPipe(
  generateNewPasswordTokenParamsSchema
);

@Controller("users/forgot-password/:email")
@Public()
export class GenerateNewPasswordTokenController {
  constructor(
    private generateNewPasswordTokenUseCase: GenerateNewPasswordTokenUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async create(
    @Param(paramsValidationPipe) params: GenerateNewPasswordTokenParams
  ) {
    const { email } = params;

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
  }
}
