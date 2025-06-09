import {
  Controller,
  Post,
  Body,
  HttpCode,
  ConflictException,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { AlreadyExistsEmailError } from "@/domain/user/application/use-cases/errors/already-exists-email-error";
import { Public } from "@/infra/auth/public";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Roles } from "@/infra/auth/roles.decorator";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { CreateTempUserUseCase } from "@/domain/user/application/use-cases/create-temp-user";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";

const createTempUserBodySchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be at most 255 characters")
    .transform((email) => email.toLowerCase().trim()),

  name: z
    .string({
      required_error: "User name is required",
      invalid_type_error: "User name must be a string",
    })
    .min(3, "User name must be at least 3 characters")
    .max(255, "User name must be at most 255 characters")
    .transform((name) => name.trim()),

  role: z.nativeEnum(UserRole, {
    required_error: "Role is required",
    invalid_type_error: "Role must be a string",
  }),
});

type CreateTempUserBody = z.infer<typeof createTempUserBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(createTempUserBodySchema);

@Controller("/users")
export class CreateUserTempController {
  constructor(private createTempUserUseCase: CreateTempUserUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(UserRole.ADMIN)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateTempUserBody
  ) {
    const { userId } = user;
    const { email, name, role } = body;

    const result = await this.createTempUserUseCase.execute({
      authenticateId: userId,
      email,
      name,
      role,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotAdminError) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof AlreadyExistsEmailError) {
        throw new ConflictException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }
  }
}
