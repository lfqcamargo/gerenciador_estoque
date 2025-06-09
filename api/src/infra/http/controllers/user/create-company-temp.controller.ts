import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { CreateTempCompanyUseCase } from "@/domain/user/application/use-cases/create-temp-company";
import { AlreadyExistsCnpjError } from "@/domain/user/application/use-cases/errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "@/domain/user/application/use-cases/errors/already-exists-email-error";
import { Public } from "@/infra/auth/public";
import { validateCNPJ } from "@/utils/validate-cnpj";

const createTempUserBodySchema = z.object({
  cnpj: z
    .string({
      required_error: "CNPJ is required",
      invalid_type_error: "CNPJ must be a string",
    })
    .length(14, "CNPJ must be exactly 14 characters")
    .regex(/^\d+$/, "CNPJ must contain only numbers")
    .transform((cnpj) => cnpj.trim())
    .refine((cnpj) => validateCNPJ(cnpj), {
      message: "CNPJ inválido",
    }),

  companyName: z
    .string({
      required_error: "Company name is required",
      invalid_type_error: "Company name must be a string",
    })
    .min(3, "Company name must be at least 3 characters")
    .max(255, "Company name must be at most 255 characters")
    .transform((name) => name.trim()),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be at most 255 characters")
    .transform((email) => email.toLowerCase().trim()),

  userName: z
    .string({
      required_error: "User name is required",
      invalid_type_error: "User name must be a string",
    })
    .min(3, "User name must be at least 3 characters")
    .max(255, "User name must be at most 255 characters")
    .transform((name) => name.trim()),

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

type CreateTempUserBody = z.infer<typeof createTempUserBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(createTempUserBodySchema);

@Controller("/companies")
@Public()
export class CreateCompanyTempController {
  constructor(private createTempCompanyUseCase: CreateTempCompanyUseCase) {}

  @Post()
  @HttpCode(201)
  async create(@Body(bodyValidationPipe) body: CreateTempUserBody) {
    const { cnpj, companyName, email, userName, password } = body;

    const result = await this.createTempCompanyUseCase.execute({
      cnpj,
      companyName,
      email,
      userName,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof AlreadyExistsCnpjError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof AlreadyExistsEmailError) {
        throw new ConflictException(error.message);
      }

      throw new InternalServerErrorException("Unexpected error");
    }
  }
}
