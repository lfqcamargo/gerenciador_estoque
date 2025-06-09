import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Redis } from "ioredis";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CacheModule } from "@/infra/cache/cache.module";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";
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

    const tempCompany = TempCompany.create({
      cnpj: "63241761000155",
      companyName: "Lfqcamargo Company",
      email: "lfqcamargo@gmail.com",
      userName: "Lucas Camargo",
      password: "hashedPassword123",
      token,
      expiration,
    });

    await cacheRepository.set("temp-company:" + tempCompany.cnpj, {
      id: tempCompany.id.toString(),
      cnpj: tempCompany.cnpj,
      companyName: tempCompany.companyName,
      email: tempCompany.email,
      userName: tempCompany.userName,
      password: tempCompany.password,
      token: tempCompany.token,
      expiration: tempCompany.expiration.toISOString(),
    });

    DomainEvents.shouldRun = true;

    const response = await request(app.getHttpServer()).get(
      `/companies/token/${token}`
    );

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(tempCompany.email);

    const company = await prisma.company.findUnique({
      where: {
        cnpj: tempCompany.cnpj,
      },
      include: {
        users: true,
      },
    });

    expect(company).toBeTruthy();
    expect(company?.cnpj).toBe(tempCompany.cnpj);
    expect(company?.name).toBe(tempCompany.companyName);

    expect(company?.users[0]).toBeTruthy();
    expect(company?.users[0].email).toBe(tempCompany.email);
    expect(company?.users[0].name).toBe(tempCompany.userName);
    expect(company?.users[0].role).toBe("ADMIN");

    const cachedCompany = await cacheRepository.get(
      "temp-company:" + tempCompany.cnpj
    );
    expect(cachedCompany).toBeNull();
  });
});
