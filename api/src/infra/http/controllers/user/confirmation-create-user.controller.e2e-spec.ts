import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Redis } from "ioredis";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CacheModule } from "@/infra/cache/cache.module";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { TempUser } from "@/domain/user/enterprise/entities/temp-user";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { CompanyFactory } from "test/factories/make-company";

describe("Confirmation Create User (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let cacheRepository: RedisCacheRepository;
  let companyFactory: CompanyFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [CompanyFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    redis = moduleRef.get(Redis);
    cacheRepository = moduleRef.get(RedisCacheRepository);
    companyFactory = moduleRef.get(CompanyFactory);

    await app.init();
  });

  test("[GET] /users/token/:token", async () => {
    const companyNew = await companyFactory.makePrismaCompany();

    const token = new UniqueEntityID().toString();
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const tempUser = TempUser.create({
      companyId: companyNew.id,
      email: "lfqcamargo@gmail.com",
      name: "Lucas Camargo",
      userRole: UserRole.ADMIN,
      token,
      expiration,
    });

    await cacheRepository.set("temp-user:" + tempUser.email, {
      id: tempUser.id.toString(),
      companyId: tempUser.companyId.toString(),
      email: "lfqcamargo@gmail.com",
      name: "Lucas Camargo",
      userRole: tempUser.userRole,
      token: tempUser.token,
      expiration: tempUser.expiration.toISOString(),
    });

    DomainEvents.shouldRun = true;

    const response = await request(app.getHttpServer())
      .post(`/users/confirmation/${token}`)
      .send({
        password: "123456789Lfqcamargo@",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(tempUser.email);

    const user = await prisma.user.findUnique({
      where: {
        email: "lfqcamargo@gmail.com",
      },
    });

    expect(user).toBeTruthy();
    expect(user?.name).toBe(tempUser.name);
    expect(user?.email).toBe(tempUser.email);
    expect(user?.role).toBe(tempUser.userRole);
    expect(user?.companyId).toBe(tempUser.companyId.toString());

    const cachedUser = await cacheRepository.get("temp-user:" + tempUser.email);
    expect(cachedUser).toBeNull();
  });
});
