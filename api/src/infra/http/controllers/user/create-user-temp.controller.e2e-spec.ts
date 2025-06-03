import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Redis } from "ioredis";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CacheModule } from "@/infra/cache/cache.module";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";

describe("Create User Temp (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let cacheRepository: RedisCacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    redis = moduleRef.get(Redis);
    cacheRepository = moduleRef.get(RedisCacheRepository);

    await app.init();
  });

  afterAll(async () => {
    await redis.quit();
    await app.close();
  });

  test("[POST] /companies", async () => {
    const userData = {
      cnpj: "63241761000155",
      companyName: "Lfqcamargo Company",
      email: "lfqcamargo@gmail.com",
      userName: "Lucas Camargo",
      password: "123456789Lfqcamargo@",
    };

    const response = await request(app.getHttpServer())
      .post("/companies")
      .send(userData);

    expect(response.statusCode).toBe(201);

    // Verifica se o usuário foi criado no cache
    const cachedUser = await cacheRepository.get("temp-user:" + userData.cnpj);
    expect(cachedUser).toBeTruthy();
    expect(cachedUser).toMatchObject({
      cnpj: userData.cnpj,
      companyName: userData.companyName,
      email: userData.email,
      userName: userData.userName,
    });
    expect(cachedUser.token).toBeDefined();
    expect(cachedUser.expiration).toBeDefined();
    expect(cachedUser.password).toBeDefined();
    expect(cachedUser.password).not.toBe(userData.password);
  });
});
