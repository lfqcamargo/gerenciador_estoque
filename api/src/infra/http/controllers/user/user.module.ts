import { Module } from "@nestjs/common";

import { CreateTempUserUseCase } from "@/domain/user/application/use-cases/create-temp-user";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { CreateUserTempController } from "./create-user-temp.controller";
import { DatabaseModule } from "@/infra/database/database.module";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserTempController],
  providers: [CreateTempUserUseCase],
})
export class UserModule {}
