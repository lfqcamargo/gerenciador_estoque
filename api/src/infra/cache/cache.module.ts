import { Module } from "@nestjs/common";
import { RedisModule } from "./redis/redis.module";
import { CacheRepository } from "./cache-repository";
import { RedisCacheRepository } from "./redis/redis-cache-repository";

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository, RedisModule],
})
export class CacheModule {}
