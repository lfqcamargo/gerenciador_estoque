import { Module } from "@nestjs/common";

import { CreateTempCompanyUseCase } from "@/domain/user/application/use-cases/create-temp-company";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { CreateCompanyTempController } from "./create-company-temp.controller";
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
import { EventModule } from "@/infra/event/event.module";
import { GetProfileCompanyController } from "./get-profile-company.controller";
import { GetProfileCompanyUseCase } from "@/domain/user/application/use-cases/get-profile-company";
import { GetProfileUserController } from "./get-profile-user.controller";
import { GetProfileUserUseCase } from "@/domain/user/application/use-cases/get-profile-user";
import { EditCompanyController } from "./edit-company.controller";
import { EditCompanyUseCase } from "@/domain/user/application/use-cases/edit-company";
import { CreateUserTempController } from "./create-user-temp.controller";
import { CreateTempUserUseCase } from "@/domain/user/application/use-cases/create-temp-user";
import { ConfirmationCreateUserController } from "./confirmation-create-user.controller";
import { ConfirmationCreateUserUseCase } from "@/domain/user/application/use-cases/confirmation-create-user";
import { FetchUsersCompanyIdController } from "./fetch-users-company-id.controller";
import { FetchUsersCompanyIdUseCase } from "@/domain/user/application/use-cases/fetch-users-company-id";
import { EditUserController } from "./edit-user.controller";
import { EditUserUseCase } from "@/domain/user/application/use-cases/edit-user";
import { DeleteUserController } from "./delete-user-controller";
import { DeleteUserUseCase } from "@/domain/user/application/use-cases/delete-user";

@Module({
  imports: [DatabaseModule, CryptographyModule, RedisModule, EventModule],
  controllers: [
    CreateCompanyTempController,
    ConfirmationCreateCompanyController,
    GenerateNewPasswordTokenController,
    ExchangePasswordForTokenController,
    AuthenticateUserController,
    GetProfileCompanyController,
    GetProfileUserController,
    EditCompanyController,
    CreateUserTempController,
    ConfirmationCreateUserController,
    FetchUsersCompanyIdController,
    EditUserController,
    DeleteUserController,
  ],
  providers: [
    CreateTempCompanyUseCase,
    ConfirmationCreateCompanyUseCase,
    GenerateNewPasswordTokenUseCase,
    ExchangePasswordForTokenUseCase,
    AuthenticateUserUseCase,
    GetProfileCompanyUseCase,
    GetProfileUserUseCase,
    EditCompanyUseCase,
    CreateTempUserUseCase,
    ConfirmationCreateUserUseCase,
    FetchUsersCompanyIdUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
