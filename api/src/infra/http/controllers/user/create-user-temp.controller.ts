import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  BadRequestException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { CreateTempUserUseCase } from "@/domain/user/application/use-cases/create-temp-user";
import { AlreadyExistsCnpjError } from "@/domain/user/application/use-cases/errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "@/domain/user/application/use-cases/errors/already-exists-email-error";

const createTempUserBodySchema = z.object({
  cnpj: z.string(),
  companyName: z.string(),
  email: z.string().email(),
  userName: z.string(),
  password: z.string(),
});

type CreateTempUserBody = z.infer<typeof createTempUserBodySchema>;

@Controller("companies")
export class CreateUserTempController {
  constructor(private createTempUserUseCase: CreateTempUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTempUserBodySchema))
  async create(@Body() body: CreateTempUserBody) {
    const { cnpj, companyName, email, userName, password } = body;

    const result = await this.createTempUserUseCase.execute({
      cnpj,
      companyName,
      email,
      userName,
      password,
    });

    if (result.isLeft()) {
      const eror = result.value;

      switch (eror.constructor) {
        case AlreadyExistsCnpjError:
          throw new BadRequestException(eror.message);
        case AlreadyExistsEmailError:
          throw new BadRequestException(eror.message);
        default:
          throw new BadRequestException(eror.message);
      }
    }
  }
}
