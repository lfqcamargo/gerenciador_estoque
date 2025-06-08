import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { UserModule } from "./controllers/user/user.module";
import { EmailModule } from "../event/email/email.module";
import { EventModule } from "@/infra/event/event.module";
import { SharedModule } from "./controllers/shared/shared.module";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    UserModule,
    EmailModule,
    EventModule,
    SharedModule,
  ],
})
export class HttpModule {}
