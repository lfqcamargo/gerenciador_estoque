import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { UserFactory } from "test/factories/make-user";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { CompanyFactory } from "test/factories/make-company";
import cookieParser from "cookie-parser";

describe("[DELETE] /users/:id (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyFactory: CompanyFactory;
  let userFactory: UserFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.enableCors({ credentials: true });

    prisma = moduleRef.get(PrismaService);
    companyFactory = moduleRef.get(CompanyFactory);
    userFactory = moduleRef.get(UserFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  it("should allow admin to delete a user", async () => {
    const company = await companyFactory.makePrismaCompany();

    const admin = await userFactory.makePrismaUser({
      companyId: company.id,
      name: "Admin",
      role: UserRole.ADMIN,
    });

    const employee = await userFactory.makePrismaUser({
      companyId: company.id,
      name: "Employee",
      email: "employee@example.com",
    });

    const accessToken = jwtService.sign({
      companyId: company.id.toString(),
      userId: admin.id.toString(),
      role: "ADMIN",
    });

    const response = await request(app.getHttpServer())
      .delete(`/users/${employee.id.toString()}`)
      .set("Cookie", `token=${accessToken}`);

    console.log(response.body);
    expect(response.statusCode).toBe(204);

    const deletedUser = await prisma.user.findUnique({
      where: { id: employee.id.toString() },
    });
    expect(deletedUser?.deletedAt).not.toBeNull();
  });
});
