import { Injectable } from "@nestjs/common";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { TempUser } from "@/domain/user/enterprise/entities/tempUser";
import { PrismaService } from "../prisma.service";
import { PrismaTempUserMapper } from "../mappers/prisma-temp-user-mapper";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaTempUsersRepository implements TempUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(tempUser: TempUser): Promise<void> {
    await this.prisma.tempUser.create({
      data: PrismaTempUserMapper.toPrisma(tempUser),
    });

    DomainEvents.dispatchEventsForAggregate(tempUser.id);
  }

  async findByEmail(email: string): Promise<TempUser | null> {
    const tempUser = await this.prisma.tempUser.findUnique({
      where: { email },
    });
    return tempUser ? PrismaTempUserMapper.toDomain(tempUser) : null;
  }

  async findByCnpj(cnpj: string): Promise<TempUser | null> {
    const tempUser = await this.prisma.tempUser.findUnique({
      where: { cnpj },
    });
    return tempUser ? PrismaTempUserMapper.toDomain(tempUser) : null;
  }

  async findByToken(token: string): Promise<TempUser | null> {
    const tempUser = await this.prisma.tempUser.findUnique({
      where: { token },
    });

    return tempUser ? PrismaTempUserMapper.toDomain(tempUser) : null;
  }
  async delete(tempUser: TempUser): Promise<void> {
    await this.prisma.tempUser.delete({
      where: { id: tempUser.id.toString() },
    });
  }

  async deleteByCnpj(cnpj: string): Promise<void> {
    await this.prisma.tempUser.delete({
      where: { cnpj },
    });
  }
}
