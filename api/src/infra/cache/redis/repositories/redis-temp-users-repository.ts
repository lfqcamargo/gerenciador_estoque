import { Injectable } from "@nestjs/common";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { TempUser } from "@/domain/user/enterprise/entities/tempUser";
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
      userName: tempUser.userName,
      email: tempUser.email,
      password: tempUser.password,
      companyName: tempUser.companyName,
      cnpj: tempUser.cnpj,
      token: tempUser.token,
      expiration: tempUser.expiration.toISOString(),
    };

    await this.cacheRepository.set(this.prefix + tempUser.cnpj, data, ttl);

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

  async findByCnpj(cnpj: string): Promise<TempUser | null> {
    const data = await this.cacheRepository.get(this.prefix + cnpj);
    if (!data) return null;

    return this.mapToTempUser(data);
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
    await this.cacheRepository.delete(this.prefix + tempUser.cnpj);
  }

  async deleteByCnpj(cnpj: string): Promise<void> {
    const tempUser = await this.findByCnpj(cnpj);
    if (tempUser) {
      await this.delete(tempUser);
    }
  }

  private mapToTempUser(data: any): TempUser {
    return TempUser.create(
      {
        userName: data.userName,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        cnpj: data.cnpj,
        token: data.token,
        expiration: new Date(data.expiration),
      },
      new UniqueEntityID(data.id)
    );
  }
}
