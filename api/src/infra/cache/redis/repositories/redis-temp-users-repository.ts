import { Injectable } from "@nestjs/common";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { TempUser } from "@/domain/user/enterprise/entities/temp-user";
import { DomainEvents } from "@/core/events/domain-events";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { RedisCacheRepository } from "../redis-cache-repository";
import { Redis } from "ioredis";

@Injectable()
export class RedisTempUsersRepository implements TempUsersRepository {
  private prefix = "temp-user:";

  constructor(
    private cacheRepository: RedisCacheRepository,
    private redis: Redis
  ) {}

  async create(tempUser: TempUser): Promise<void> {
    const ttl = Math.floor((tempUser.expiration.getTime() - Date.now()) / 1000);

    if (ttl <= 0) {
      return;
    }

    const data = {
      id: tempUser.id.toString(),
      name: tempUser.name,
      email: tempUser.email,
      companyId: tempUser.companyId.toString(),
      token: tempUser.token,
      expiration: tempUser.expiration.toISOString(),
      userRole: tempUser.userRole,
    };

    await this.cacheRepository.set(this.prefix + tempUser.email, data, ttl);

    DomainEvents.dispatchEventsForAggregate(tempUser.id);
  }

  async findByEmail(email: string): Promise<TempUser | null> {
    const keys = await this.redis.keys(this.prefix + "*");

    for (const key of keys) {
      const data = await this.cacheRepository.get(key);
      if (!data) continue;

      if (data.email === email) {
        return this.mapToTempUser(data);
      }
    }

    return null;
  }

  async findByToken(token: string): Promise<TempUser | null> {
    const keys = await this.redis.keys(this.prefix + "*");

    for (const key of keys) {
      const data = await this.cacheRepository.get(key);
      if (!data) continue;

      if (data.token === token) {
        return this.mapToTempUser(data);
      }
    }

    return null;
  }

  async delete(tempUser: TempUser): Promise<void> {
    await this.cacheRepository.delete(this.prefix + tempUser.email);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.cacheRepository.delete(this.prefix + email);
  }

  private mapToTempUser(data: any): TempUser {
    return TempUser.create(
      {
        name: data.name,
        email: data.email,
        companyId: data.companyId,
        token: data.token,
        expiration: new Date(data.expiration),
        userRole: data.userRole,
      },
      new UniqueEntityID(data.id)
    );
  }
}
