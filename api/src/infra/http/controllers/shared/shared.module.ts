import { Module } from "@nestjs/common";

import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { RedisModule } from "@/infra/cache/redis/redis.module";
import { EventModule } from "@/infra/event/event.module";
import { StorageModule } from "@/infra/storage/storage.module";
import { UploadAttachmentController } from "./upload-attachment.controller";
import { UploadAndCreateAttachmentUseCase } from "@/domain/shared/application/use-cases/upload-and-create-attachment";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    RedisModule,
    EventModule,
    StorageModule,
  ],
  controllers: [UploadAttachmentController],
  providers: [UploadAndCreateAttachmentUseCase],
})
export class SharedModule {}
