import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Redis from "ioredis";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { RedisPasswordTokensRepository } from "./repositories/redis-password-tokens-repository";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { RedisTempUsersRepository } from "./repositories/redis-temp-users-repository";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Redis,
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || "localhost",
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD,
        });
      },
    },
    {
      provide: PasswordTokensRepository,
      useClass: RedisPasswordTokensRepository,
    },
    {
      provide: TempUsersRepository,
      useClass: RedisTempUsersRepository,
    },
  ],
  exports: [PasswordTokensRepository, TempUsersRepository],
})
export class RedisModule {}
