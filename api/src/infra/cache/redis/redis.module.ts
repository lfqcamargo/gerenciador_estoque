import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Redis from "ioredis";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { RedisPasswordTokensRepository } from "./repositories/redis-password-tokens-repository";
import { TempCompaniesRepository } from "@/domain/user/application/repositories/temp-companies-repository";
import { RedisTempCompaniesRepository } from "./repositories/redis-temp-compánies-repository";
import { RedisCacheRepository } from "./redis-cache-repository";
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
    RedisCacheRepository,
    {
      provide: PasswordTokensRepository,
      useFactory: (cacheRepository: RedisCacheRepository, redis: Redis) => {
        return new RedisPasswordTokensRepository(cacheRepository, redis);
      },
      inject: [RedisCacheRepository, Redis],
    },
    {
      provide: TempCompaniesRepository,
      useFactory: (cacheRepository: RedisCacheRepository, redis: Redis) => {
        return new RedisTempCompaniesRepository(cacheRepository, redis);
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
    TempCompaniesRepository,
    TempUsersRepository,
  ],
})
export class RedisModule {}
