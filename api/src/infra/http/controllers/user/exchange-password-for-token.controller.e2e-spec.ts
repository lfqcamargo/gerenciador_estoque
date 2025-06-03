import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CompanyFactory } from "test/factories/make-company";
import { UserFactory } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Redis } from "ioredis";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";

describe("Exchange Password For Token (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let companyFactory: CompanyFactory;
  let redis: Redis;
  let cacheRepository: RedisCacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [UserFactory, CompanyFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    companyFactory = moduleRef.get(CompanyFactory);
    redis = moduleRef.get(Redis);
    cacheRepository = moduleRef.get(RedisCacheRepository);

    await app.init();
  });

  test("[POST] /users/password/reset/:token", async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id.toString(),
      email: "lfqcamargo@gmail.com",
    });

    const token = new UniqueEntityID().toString();
    const expiration = new Date(Date.now() + 1000 * 60 * 60);

    await cacheRepository.set(`password-token:${token}`, {
      id: user.id.toString(),
      userId: user.id.toString(),
      email: user.email,
      token,
      expiration,
    });

    const response = await request(app.getHttpServer())
      .post(`/users/password/reset/${token}`)
      .send({
        password: "123456789Lfqcamargo@",
      });

    expect(response.statusCode).toBe(204);
  });
});
