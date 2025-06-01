import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { PasswordToken } from "@/domain/user/enterprise/entities/passwordToken";
import { PrismaPasswordTokenMapper } from "../mappers/prisma-password-token-mapper";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaPasswordTokensRepository
  implements PasswordTokensRepository
{
  constructor(private prisma: PrismaService) {}

  async create(passwordToken: PasswordToken): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.passwordToken.deleteMany({
        where: {
          userId: passwordToken.userId,
        },
      });

      await tx.passwordToken.create({
        data: PrismaPasswordTokenMapper.toPrisma(passwordToken),
      });

      DomainEvents.dispatchEventsForAggregate(passwordToken.id);
    });
  }

  async findByToken(token: string): Promise<PasswordToken | null> {
    const passwordToken = await this.prisma.passwordToken.findUnique({
      where: {
        token,
      },
    });

    if (!passwordToken) {
      return null;
    }

    return PrismaPasswordTokenMapper.toDomain(passwordToken);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.passwordToken.delete({
      where: {
        token,
      },
    });
  }
}
