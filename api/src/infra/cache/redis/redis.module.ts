import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Redis from "ioredis";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { RedisPasswordTokensRepository } from "./repositories/redis-password-tokens-repository";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { RedisTempUsersRepository } from "./repositories/redis-temp-users-repository";
import { RedisCacheRepository } from "./redis-cache-repository";

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
    RedisCacheRepository,
    {
      provide: PasswordTokensRepository,
      useFactory: (cacheRepository: RedisCacheRepository, redis: Redis) => {
        return new RedisPasswordTokensRepository(cacheRepository, redis);
      },
      inject: [RedisCacheRepository, Redis],
    },
    {
      provide: TempUsersRepository,
      useFactory: (cacheRepository: RedisCacheRepository, redis: Redis) => {
        return new RedisTempUsersRepository(cacheRepository, redis);
      },
      inject: [RedisCacheRepository, Redis],
    },
  ],
  exports: [
    Redis,
    RedisCacheRepository,
    PasswordTokensRepository,
    TempUsersRepository,
  ],
})
export class RedisModule {}
