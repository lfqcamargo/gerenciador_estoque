import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserRole } from "@/domain/user/enterprise/entities/user";
import { User as PrismaUser, Prisma } from "generated/prisma";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as UserRole,
        companyId: raw.companyId,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: "ADMIN",
      companyId: user.companyId,
    };
  }
}
