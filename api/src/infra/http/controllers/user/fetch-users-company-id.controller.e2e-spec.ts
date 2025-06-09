import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CompanyFactory } from "test/factories/make-company";
import { UserFactory } from "test/factories/make-user";
import { CacheModule } from "@/infra/cache/cache.module";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@/domain/user/enterprise/entities/user";

describe("[GET] /users (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyFactory: CompanyFactory;
  let userFactory: UserFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [CompanyFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    companyFactory = moduleRef.get(CompanyFactory);
    userFactory = moduleRef.get(UserFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  it("should fetch users from the authenticated user's company", async () => {
    const company = await companyFactory.makePrismaCompany();

    const admin = await userFactory.makePrismaUser({
      companyId: company.id.toString(),
      role: UserRole.ADMIN,
    });

    await userFactory.makePrismaUser({
      companyId: company.id.toString(),
      role: UserRole.EMPLOYEE,
    });

    const accessToken = jwtService.sign({
      companyId: company.id.toString(),
      userId: admin.id.toString(),
      role: UserRole.ADMIN,
    });

    const response = await request(app.getHttpServer())
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users.length).toBeGreaterThanOrEqual(1);
    expect(response.body.users[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      })
    );
  });
});
