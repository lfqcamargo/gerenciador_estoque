import {
  Controller,
  Put,
  Body,
  HttpCode,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { EditCompanyUseCase } from "@/domain/user/application/use-cases/edit-company";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";

const editCompanyBodySchema = z.object({
  name: z
    .string({
      required_error: "Company name is required",
      invalid_type_error: "Company name must be a string",
    })
    .min(3, "Company name must be at least 3 characters")
    .max(255, "Company name must be at most 255 characters")
    .transform((name) => name.trim()),
  lealName: z
    .string({
      required_error: "Leal name is required",
      invalid_type_error: "Leal name must be a string",
    })
    .min(3, "Leal name must be at least 3 characters")
    .max(100, "Leal name must be at most 100 characters")
    .transform((name) => name.trim())
    .optional(),
  photoId: z
    .string({
      required_error: "Photo is required",
      invalid_type_error: "Photo must be a string",
    })
    .max(100, "Photo must be at most 100 characters")
    .optional()
    .nullable(),
});

type EditCompanyBody = z.infer<typeof editCompanyBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editCompanyBodySchema);

@Controller("companies")
export class EditCompanyController {
  constructor(private editCompanyUseCase: EditCompanyUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCompanyBody,
    @CurrentUser() user: UserPayload
  ) {
    const { companyId, userId, role } = user;
    const { name, lealName, photoId } = body;

    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException("User is not an admin");
    }

    const result = await this.editCompanyUseCase.execute({
      companyId,
      authenticateUserId: userId,
      name,
      lealName: lealName ?? null,
      photoId: photoId ?? null,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException(error.message);
      }

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
