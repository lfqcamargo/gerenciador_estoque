import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CompanyFactory } from "test/factories/make-company";
import { UserFactory } from "test/factories/make-user";
import cookieParser from "cookie-parser";

describe("Upload attachment (E2E)", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let companyFactory: CompanyFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.enableCors({ credentials: true });

    jwtService = moduleRef.get(JwtService);
    companyFactory = moduleRef.get(CompanyFactory);
    userFactory = moduleRef.get(UserFactory);
    await app.init();
  });

  test("[POST] /attachments", async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      email: "lfqcamargo@gmail.com",
    });

    const accessToken = jwtService.sign({
      companyId: company.id.toString(),
      userId: user.id.toString(),
      role: "ADMIN",
    });

    const response = await request(app.getHttpServer())
      .post("/attachments")
      .set("Cookie", `token=${accessToken}`)
      .attach("file", "./test/e2e/sample-upload.png");

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
