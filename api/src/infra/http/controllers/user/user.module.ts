import { Module } from "@nestjs/common";

import { CreateTempUserUseCase } from "@/domain/user/application/use-cases/create-temp-user";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { CreateUserTempController } from "./create-user-temp.controller";
import { DatabaseModule } from "@/infra/database/database.module";
import { ConfirmationCreateCompanyController } from "./confirmation-create-company.controller";
import { ConfirmationCreateCompanyUseCase } from "@/domain/user/application/use-cases/confirmation-create-company";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserTempController, ConfirmationCreateCompanyController],
  providers: [CreateTempUserUseCase, ConfirmationCreateCompanyUseCase],
})
export class UserModule {}
