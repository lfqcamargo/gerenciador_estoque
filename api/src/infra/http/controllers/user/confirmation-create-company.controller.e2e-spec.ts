import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Redis } from "ioredis";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CacheModule } from "@/infra/cache/cache.module";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { TempUser } from "@/domain/user/enterprise/entities/tempUser";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";

describe("Confirmation Create Company (E2E)", () => {
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

  test("[GET] /companies/token/:token", async () => {
    const token = new UniqueEntityID().toString();
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const tempUser = TempUser.create({
      cnpj: "63241761000155",
      companyName: "Lfqcamargo Company",
      email: "lfqcamargo@gmail.com",
      userName: "Lucas Camargo",
      password: "hashedPassword123",
      token,
      expiration,
    });

    await cacheRepository.set("temp-user:" + tempUser.cnpj, {
      id: tempUser.id.toString(),
      cnpj: tempUser.cnpj,
      companyName: tempUser.companyName,
      email: tempUser.email,
      userName: tempUser.userName,
      password: tempUser.password,
      token: tempUser.token,
      expiration: tempUser.expiration.toISOString(),
    });

    DomainEvents.shouldRun = true;

    const response = await request(app.getHttpServer()).get(
      `/companies/token/${token}`
    );

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(tempUser.email);

    const company = await prisma.company.findUnique({
      where: {
        cnpj: tempUser.cnpj,
      },
      include: {
        users: true,
      },
    });

    expect(company).toBeTruthy();
    expect(company?.cnpj).toBe(tempUser.cnpj);
    expect(company?.name).toBe(tempUser.companyName);

    expect(company?.users[0]).toBeTruthy();
    expect(company?.users[0].email).toBe(tempUser.email);
    expect(company?.users[0].name).toBe(tempUser.userName);
    expect(company?.users[0].role).toBe("ADMIN");

    const cachedUser = await cacheRepository.get("temp-user:" + tempUser.cnpj);
    expect(cachedUser).toBeNull();
  });
});
