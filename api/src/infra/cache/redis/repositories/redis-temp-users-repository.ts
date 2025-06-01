import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { TempUser } from "@/domain/user/enterprise/entities/tempUser";
import { DomainEvents } from "@/core/events/domain-events";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

@Injectable()
export class RedisTempUsersRepository implements TempUsersRepository {
  constructor(private redis: Redis) {}

  async create(tempUser: TempUser): Promise<void> {
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

    await this.redis.set(
      `temp-user:${tempUser.id.toString()}`,
      JSON.stringify(data)
    );

    DomainEvents.dispatchEventsForAggregate(tempUser.id);
  }

  async findByEmail(email: string): Promise<TempUser | null> {
    const keys = await this.redis.keys("temp-user:*");

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (!data) continue;

      const tempUser = JSON.parse(data);
      if (tempUser.email === email) {
        return this.mapToTempUser(tempUser);
      }
    }

    return null;
  }

  async findByCnpj(cnpj: string): Promise<TempUser | null> {
    const keys = await this.redis.keys("temp-user:*");

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (!data) continue;

      const tempUser = JSON.parse(data);
      if (tempUser.cnpj === cnpj) {
        return this.mapToTempUser(tempUser);
      }
    }

    return null;
  }

  async findByToken(token: string): Promise<TempUser | null> {
    const keys = await this.redis.keys("temp-user:*");

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (!data) continue;

      const tempUser = JSON.parse(data);
      if (tempUser.token === token) {
        return this.mapToTempUser(tempUser);
      }
    }

    return null;
  }

  async delete(tempUser: TempUser): Promise<void> {
    await this.redis.del(`temp-user:${tempUser.id.toString()}`);
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
