import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { PasswordToken } from "@/domain/user/enterprise/entities/passwordToken";
import { DomainEvents } from "@/core/events/domain-events";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

@Injectable()
export class RedisPasswordTokensRepository implements PasswordTokensRepository {
  private prefix = "password-token:";
  private userPrefix = "user-token:";

  constructor(private redis: Redis) {}

  async create(passwordToken: PasswordToken): Promise<void> {
    const tokenKey = this.prefix + passwordToken.token;
    const userKey = this.userPrefix + passwordToken.userId;

    // Calcula o TTL em segundos baseado na data de expiração
    const ttl = Math.floor(
      (passwordToken.expiration.getTime() - Date.now()) / 1000
    );

    // Se o TTL for negativo, significa que o token já expirou
    if (ttl <= 0) {
      return;
    }

    const pipeline = this.redis.pipeline();

    // Remove token antigo do usuário se existir
    const oldToken = await this.redis.get(userKey);
    if (oldToken) {
      pipeline.del(this.prefix + oldToken);
    }

    // Salva o novo token com TTL
    pipeline
      .set(
        tokenKey,
        JSON.stringify({
          id: passwordToken.id.toString(),
          userId: passwordToken.userId,
          token: passwordToken.token,
          expiration: passwordToken.expiration.toISOString(),
        })
      )
      .expire(tokenKey, ttl)
      // Salva a referência do token no usuário
      .set(userKey, passwordToken.token)
      .expire(userKey, ttl);

    await pipeline.exec();

    DomainEvents.dispatchEventsForAggregate(passwordToken.id);
  }

  async findByToken(token: string): Promise<PasswordToken | null> {
    const data = await this.redis.get(this.prefix + token);

    if (!data) {
      return null;
    }

    const { id, userId, token: storedToken, expiration } = JSON.parse(data);

    return PasswordToken.create(
      {
        userId,
        token: storedToken,
        expiration: new Date(expiration),
      },
      new UniqueEntityID(id)
    );
  }

  async deleteByToken(token: string): Promise<void> {
    const tokenKey = this.prefix + token;
    const data = await this.redis.get(tokenKey);

    if (data) {
      const { userId } = JSON.parse(data);
      const userKey = this.userPrefix + userId;

      await this.redis.pipeline().del(tokenKey).del(userKey).exec();
    }
  }
}
