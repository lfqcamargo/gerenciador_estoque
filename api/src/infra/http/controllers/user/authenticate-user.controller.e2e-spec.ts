import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";
import { CompanyFactory } from "test/factories/make-company";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let companyFactory: CompanyFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    companyFactory = moduleRef.get(CompanyFactory);

    await app.init();
  });

  test("[POST] /auth", async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id.toString(),
      password: await hash("123456789Lfqcamargo@", 8),
    });

    const response = await request(app.getHttpServer()).post("/auth").send({
      email: user.email,
      password: "123456789Lfqcamargo@",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
