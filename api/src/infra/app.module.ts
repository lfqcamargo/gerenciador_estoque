import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./database/prisma/prisma.service";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./http/controllers/authenticate.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
