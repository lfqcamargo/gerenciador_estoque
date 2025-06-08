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

describe("[PUT] /companies (E2E)", () => {
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

  afterAll(async () => {
    await app.close();
  });

  it("should update company information when user is admin", async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id.toString(),
      email: "admin@company.com",
      password: "12345678A@",
    });

    const accessToken = jwtService.sign({
      companyId: company.id.toString(),
      userId: user.id.toString(),
      role: "ADMIN",
    });

    const response = await request(app.getHttpServer())
      .put("/companies")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "NewCompany1@",
        lealName: "New Legal Name",
        photo: "https://example.com/photo.png",
      });

    expect(response.statusCode).toBe(204);

    const updatedCompany = await prisma.company.findUnique({
      where: { id: company.id.toString() },
    });

    expect(updatedCompany?.name).toBe("NewCompany1@");
    expect(updatedCompany?.lealName).toBe("New Legal Name");
    expect(updatedCompany?.photo).toBe("https://example.com/photo.png");
  });
});
