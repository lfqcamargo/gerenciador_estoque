import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserRole } from "@/domain/user/enterprise/entities/user";
import {
  User as PrismaUser,
  Prisma,
  UserRole as PrismaUserRole,
} from "generated/prisma";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as UserRole,
        companyId: new UniqueEntityID(raw.companyId),
        active: raw.active,
        photoId: raw.photoId,
        createdAt: raw.createdAt,
        lastLogin: raw.lastLogin ?? null,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    console.log(user.id.toString());
    console.log(user.companyId.toString());
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role as PrismaUserRole,
      active: user.active,
      photoId: user.photoId,
      companyId: user.companyId.toString(),
      lastLogin: user.lastLogin ?? null,
      deletedAt: user.deletedAt ?? null,
    };
  }
}

// const domainToPrismaUserRoleMap: Record<UserRole, PrismaUserRole> = {
//   ADMIN: PrismaUserRole.ADMIN,
//   MANAGER: PrismaUserRole.MANAGER,
//   EMPLOYEE: PrismaUserRole.EMPLOYEE,
// };
