import { Injectable } from "@nestjs/common";
import { TempCompaniesRepository } from "@/domain/user/application/repositories/temp-companies-repository";
import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";
import { DomainEvents } from "@/core/events/domain-events";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { RedisCacheRepository } from "../redis-cache-repository";
import { Redis } from "ioredis";

@Injectable()
export class RedisTempCompaniesRepository implements TempCompaniesRepository {
  private prefix = "temp-company:";

  constructor(
    private cacheRepository: RedisCacheRepository,
    private redis: Redis
  ) {}

  async create(tempCompany: TempCompany): Promise<void> {
    const ttl = Math.floor(
      (tempCompany.expiration.getTime() - Date.now()) / 1000
    );

    if (ttl <= 0) {
      return;
    }

    const data = {
      id: tempCompany.id.toString(),
      userName: tempCompany.userName,
      email: tempCompany.email,
      password: tempCompany.password,
      companyName: tempCompany.companyName,
      cnpj: tempCompany.cnpj,
      token: tempCompany.token,
      expiration: tempCompany.expiration.toISOString(),
    };

    await this.cacheRepository.set(this.prefix + tempCompany.cnpj, data, ttl);

    DomainEvents.dispatchEventsForAggregate(tempCompany.id);
  }

  async findByEmail(email: string): Promise<TempCompany | null> {
    const keys = await this.redis.keys(this.prefix + "*");

    for (const key of keys) {
      const data = await this.cacheRepository.get(key);
      if (!data) continue;

      if (data.email === email) {
        return this.mapToTempCompany(data);
      }
    }

    return null;
  }

  async findByCnpj(cnpj: string): Promise<TempCompany | null> {
    const data = await this.cacheRepository.get(this.prefix + cnpj);
    if (!data) return null;

    return this.mapToTempCompany(data);
  }

  async findByToken(token: string): Promise<TempCompany | null> {
    const keys = await this.redis.keys(this.prefix + "*");

    for (const key of keys) {
      const data = await this.cacheRepository.get(key);
      if (!data) continue;

      if (data.token === token) {
        return this.mapToTempCompany(data);
      }
    }

    return null;
  }

  async delete(tempCompany: TempCompany): Promise<void> {
    await this.cacheRepository.delete(this.prefix + tempCompany.cnpj);
  }

  async deleteByCnpj(cnpj: string): Promise<void> {
    const tempUser = await this.findByCnpj(cnpj);
    if (tempUser) {
      await this.delete(tempUser);
    }
  }

  private mapToTempCompany(data: any): TempCompany {
    return TempCompany.create(
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
