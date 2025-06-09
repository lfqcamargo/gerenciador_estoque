import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Redis } from "ioredis";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CacheModule } from "@/infra/cache/cache.module";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { CompanyFactory } from "test/factories/make-company";
import { UserFactory } from "test/factories/make-user";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@/domain/user/enterprise/entities/user";

describe("Create User Temp (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let cacheRepository: RedisCacheRepository;
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
    redis = moduleRef.get(Redis);
    cacheRepository = moduleRef.get(RedisCacheRepository);
    companyFactory = moduleRef.get(CompanyFactory);
    userFactory = moduleRef.get(UserFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /users", async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id.toString(),
      email: "auth@company.com",
      password: "12345678A@",
      role: UserRole.ADMIN,
    });

    const accessToken = jwtService.sign({
      companyId: company.id.toString(),
      userId: user.id.toString(),
      role: UserRole.ADMIN,
    });

    const userData = {
      email: "lfqcamargo@gmail.com",
      userName: "Lucas Camargo",
      password: "123456789Lfqcamargo@",
      role: UserRole.USER,
    };

    const response = await request(app.getHttpServer())
      .post("/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(userData);

    expect(response.statusCode).toBe(201);

    const cachedUser = await cacheRepository.get("temp-user:" + userData.email);
    expect(cachedUser).toBeTruthy();
    expect(cachedUser).toMatchObject({
      email: userData.email,
      userName: userData.userName,
    });
    expect(cachedUser.token).toBeDefined();
    expect(cachedUser.expiration).toBeDefined();
    expect(cachedUser.password).toBeDefined();
    expect(cachedUser.password).not.toBe(userData.password);
  });
});
