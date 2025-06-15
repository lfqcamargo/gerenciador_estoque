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
import { AttachmentFactory } from "test/factories/make-attachment";
import cookieParser from "cookie-parser";

describe("[PUT] /companies (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyFactory: CompanyFactory;
  let userFactory: UserFactory;
  let jwtService: JwtService;
  let attachmentFactory: AttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [CompanyFactory, UserFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.enableCors({ credentials: true });

    prisma = moduleRef.get(PrismaService);
    companyFactory = moduleRef.get(CompanyFactory);
    userFactory = moduleRef.get(UserFactory);
    jwtService = moduleRef.get(JwtService);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should update company information when user is admin", async () => {
    const company = await companyFactory.makePrismaCompany();
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      email: "admin@company.com",
      password: "12345678A@",
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      companyId: company.id,
      userId: user.id,
    });

    const accessToken = jwtService.sign({
      companyId: company.id.toString(),
      userId: user.id.toString(),
      role: "ADMIN",
    });

    const response = await request(app.getHttpServer())
      .put("/companies")
      .set("Cookie", `token=${accessToken}`)
      .send({
        name: "NewCompany1@",
        lealName: "New Legal Name",
        photoId: attachment.id.toString(),
      });

    expect(response.statusCode).toBe(204);

    const updatedCompany = await prisma.company.findUnique({
      where: { id: company.id.toString() },
    });

    expect(updatedCompany?.name).toBe("NewCompany1@");
    expect(updatedCompany?.lealName).toBe("New Legal Name");
    expect(updatedCompany?.photoId).toBe(attachment.id.toString());
  });
});
