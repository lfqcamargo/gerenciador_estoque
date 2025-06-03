import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Company } from "@/domain/user/enterprise/entities/company";
import { CompanyProps } from "@/domain/user/enterprise/entities/company";
import {
  User,
  UserProps,
  UserRole,
} from "@/domain/user/enterprise/entities/user";
import { PrismaCompanyMapper } from "@/infra/database/prisma/mappers/prisma-company-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeCompany } from "./make-company";
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user-mapper";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      role: UserRole.ADMIN,
      companyId: faker.string.uuid(),
      createdAt: new Date(),
      lastLogin: new Date(),
      photo: faker.image.url(),
      ...override,
    },
    id
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}

@Injectable()
export class CompanyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompany(data: Partial<CompanyProps> = {}): Promise<Company> {
    const company = makeCompany(data);

    await this.prisma.company.create({
      data: PrismaCompanyMapper.toPrisma(company),
    });

    return company;
  }
}
