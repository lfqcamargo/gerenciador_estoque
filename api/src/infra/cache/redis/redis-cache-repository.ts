import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { CacheRepository } from "../cache-repository";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);

    if (ttl) {
      await this.redis.set(key, stringValue, "EX", ttl);
    } else {
      await this.redis.set(key, stringValue);
    }
  }

  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);

    if (!value) return null;

    return JSON.parse(value);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deleteMany(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
