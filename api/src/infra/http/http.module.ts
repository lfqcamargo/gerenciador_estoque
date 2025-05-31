import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CreateUserTempController } from "./controllers/user/create-user-temp.controller";
import { CreateTempUserUseCase } from "@/domain/user/application/use-cases/create-temp-user";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserTempController],
  providers: [CreateTempUserUseCase],
})
export class HttpModule {}
