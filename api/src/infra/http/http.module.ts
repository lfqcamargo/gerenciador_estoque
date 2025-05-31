import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { UserModule } from "./controllers/user/user.module";
import { EmailModule } from "../notification/email/email.module";
import { NotificationModule } from "@/infra/notification/notification.module";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    UserModule,
    EmailModule,
    NotificationModule,
  ],
})
export class HttpModule {}
