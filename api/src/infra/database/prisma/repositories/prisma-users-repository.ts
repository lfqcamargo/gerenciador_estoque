import { Injectable } from "@nestjs/common";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { User } from "@/domain/user/enterprise/entities/user";
import { PrismaService } from "../prisma.service";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: PrismaUserMapper.toPrisma(user),
    });

    DomainEvents.dispatchEventsForAggregate(user.id);
  }
}
