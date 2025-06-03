import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Redis } from "ioredis";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CacheModule } from "@/infra/cache/cache.module";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { makeUser } from "test/factories/make-user";
import { makeCompany } from "test/factories/make-company";
import { CompanyFactory } from "test/factories/make-company";
import { UserFactory } from "test/factories/make-user";

describe("Generate New Password Token (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let cacheRepository: RedisCacheRepository;
  let companyFactory: CompanyFactory;
  let userFactory: UserFactory;

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

    await app.init();
  });

  afterAll(async () => {
    await redis.quit();
    await app.close();
  });

  test("[GET] /users/forgot-password/:email", async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id.toString(),
    });

    const response = await request(app.getHttpServer()).get(
      `/users/forgot-password/${user.email}`
    );

    expect(response.statusCode).toBe(200);

    // Verifica se o token foi criado no Redis
    const keys = await redis.keys("password-token:*");
    expect(keys).toHaveLength(1);

    const token = await cacheRepository.get(keys[0]);
    expect(token).toBeTruthy();
    expect(token.userId).toBe(user.id.toString());
    expect(token.expiration).toBeDefined();
  });
});
