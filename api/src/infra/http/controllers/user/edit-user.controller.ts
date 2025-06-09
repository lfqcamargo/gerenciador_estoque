import {
  Controller,
  Put,
  Body,
  HttpCode,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Param,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { EditUserUseCase } from "@/domain/user/application/use-cases/edit-user";

const editUserParamsSchema = z.object({
  id: z.string(),
});

const editUserBodySchema = z.object({
  name: z.string().min(3).max(255),
  role: z.nativeEnum(UserRole),
  active: z.boolean(),
  photoId: z.string().max(100).optional().nullable(),
});

type EditUserBody = z.infer<typeof editUserBodySchema>;
type EditUserParams = z.infer<typeof editUserParamsSchema>;

const paramsValidationPipe = new ZodValidationPipe(editUserParamsSchema);
const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema);

@Controller("users/:id")
export class EditUserController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: EditUserParams,
    @Body(bodyValidationPipe) body: EditUserBody,
    @CurrentUser() user: UserPayload
  ) {
    const { userId } = user;
    const { name, role, active, photoId } = body;

    const result = await this.editUserUseCase.execute({
      userId: params.id,
      authenticateUserId: userId,
      name,
      role,
      active,
      photoId: photoId ?? null,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotAdminError) {
        throw new ForbiddenException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }
  }
}
