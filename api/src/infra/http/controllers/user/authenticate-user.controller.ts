import {
  Controller,
  Post,
  Body,
  HttpCode,
  UnauthorizedException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { AuthenticateUserUseCase } from "@/domain/user/application/use-cases/authenticate-user";
import { WrongCredentialsError } from "@/domain/user/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";

const authenticateUserBodySchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be at most 255 characters")
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

type AuthenticateUserBody = z.infer<typeof authenticateUserBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(authenticateUserBodySchema);

@Controller("auth")
@Public()
export class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  async create(@Body(bodyValidationPipe) body: AuthenticateUserBody) {
    const { email, password } = body;

    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new UnauthorizedException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
