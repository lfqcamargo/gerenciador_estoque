import { DomainEvents } from "@/core/events/domain-events";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { PasswordToken } from "@/domain/user/enterprise/entities/passwordToken";

export class InMemoryPasswordTokensRepository
  implements PasswordTokensRepository
{
  public items: PasswordToken[] = [];

  async create(data: PasswordToken): Promise<void> {
    this.items = this.items.filter((item) => item.userId !== data.userId);

    DomainEvents.dispatchEventsForAggregate(data.id);

    this.items.push(data);
  }

  async findByToken(token: string): Promise<PasswordToken | null> {
    const passwordToken = this.items.find((item) => item.token === token);
    return passwordToken ?? null;
  }

  async deleteByToken(token: string): Promise<void> {
    this.items = this.items.filter((item) => item.token !== token);
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.items = this.items.filter((item) => item.userId !== userId);
  }
}
