import { Module } from "@nestjs/common";

import { CreateTempUserUseCase } from "@/domain/user/application/use-cases/create-temp-user";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { CreateUserTempController } from "./create-user-temp.controller";
import { DatabaseModule } from "@/infra/database/database.module";
import { ExchangePasswordForTokenController } from "./exchange-password-for-token.controller";
import { ConfirmationCreateCompanyController } from "./confirmation-create-company.controller";
import { ConfirmationCreateCompanyUseCase } from "@/domain/user/application/use-cases/confirmation-create-company";
import { GenerateNewPasswordTokenController } from "./generate-new-password-token.controller";
import { GenerateNewPasswordTokenUseCase } from "@/domain/user/application/use-cases/generate-new-password-token";
import { ExchangePasswordForTokenUseCase } from "@/domain/user/application/use-cases/exchange-password-for-token";
import { AuthenticateUserUseCase } from "@/domain/user/application/use-cases/authenticate-user";
import { AuthenticateUserController } from "./authenticate-user.controller";
import { RedisModule } from "@/infra/cache/redis/redis.module";

@Module({
  imports: [DatabaseModule, CryptographyModule, RedisModule],
  controllers: [
    CreateUserTempController,
    ConfirmationCreateCompanyController,
    GenerateNewPasswordTokenController,
    ExchangePasswordForTokenController,
    AuthenticateUserController,
  ],
  providers: [
    CreateTempUserUseCase,
    ConfirmationCreateCompanyUseCase,
    GenerateNewPasswordTokenUseCase,
    ExchangePasswordForTokenUseCase,
    AuthenticateUserUseCase,
  ],
})
export class UserModule {}
