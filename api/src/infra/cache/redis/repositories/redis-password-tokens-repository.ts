import { Injectable } from "@nestjs/common";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { PasswordToken } from "@/domain/user/enterprise/entities/passwordToken";
import { DomainEvents } from "@/core/events/domain-events";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { RedisCacheRepository } from "../redis-cache-repository";
import { Redis } from "ioredis";

@Injectable()
export class RedisPasswordTokensRepository implements PasswordTokensRepository {
  private prefix = "password-token:";

  constructor(
    private cacheRepository: RedisCacheRepository,
    private redis: Redis
  ) {}

  async create(passwordToken: PasswordToken): Promise<void> {
    const tokenKey = this.prefix + passwordToken.token;

    // Calcula o TTL em segundos baseado na data de expiração
    const ttl = Math.floor(
      (passwordToken.expiration.getTime() - Date.now()) / 1000
    );

    // Se o TTL for negativo, significa que o token já expirou
    if (ttl <= 0) {
      return;
    }

    // Remove token antigo do usuário se existir
    const oldTokens = await this.findTokensByUserId(passwordToken.userId);
    if (oldTokens.length > 0) {
      await Promise.all(
        oldTokens.map((token) =>
          this.cacheRepository.delete(this.prefix + token.token)
        )
      );
    }

    // Salva o novo token com TTL
    await this.cacheRepository.set(
      tokenKey,
      {
        id: passwordToken.id.toString(),
        userId: passwordToken.userId,
        token: passwordToken.token,
        expiration: passwordToken.expiration.toISOString(),
      },
      ttl
    );

    DomainEvents.dispatchEventsForAggregate(passwordToken.id);
  }

  async findByToken(token: string): Promise<PasswordToken | null> {
    const data = await this.cacheRepository.get(this.prefix + token);

    if (!data) {
      return null;
    }

    return PasswordToken.create(
      {
        userId: data.userId,
        token: data.token,
        expiration: new Date(data.expiration),
      },
      new UniqueEntityID(data.id)
    );
  }

  async deleteByToken(token: string): Promise<void> {
    await this.cacheRepository.delete(this.prefix + token);
  }

  private async findTokensByUserId(userId: string): Promise<PasswordToken[]> {
    const keys = await this.redis.keys(this.prefix + "*");
    const tokens: PasswordToken[] = [];

    for (const key of keys) {
      const data = await this.cacheRepository.get(key);
      if (!data) continue;

      if (data.userId === userId) {
        tokens.push(
          PasswordToken.create(
            {
              userId: data.userId,
              token: data.token,
              expiration: new Date(data.expiration),
            },
            new UniqueEntityID(data.id)
          )
        );
      }
    }

    return tokens;
  }

  async deleteByUserId(userId: string): Promise<void> {
    const keys = await this.redis.keys(this.prefix + "*");
    for (const key of keys) {
      const data = await this.cacheRepository.get(key);
      if (!data) continue;

      if (data.userId === userId) {
        await this.cacheRepository.delete(key);
      }
    }
  }
}
