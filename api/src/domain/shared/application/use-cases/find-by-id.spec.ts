import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { makeUser } from "test/factories/make-user";
import { makeCompany } from "test/factories/make-company";
import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { FindByIdUseCase } from "./find-by-id";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeAttachment } from "test/factories/make-attachment";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: FindByIdUseCase;

describe("Get profile company", () => {
  beforeEach(() => {
    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository
    );
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    sut = new FindByIdUseCase(inMemoryAttachmentsRepository);
  });

  it("should return the attachment when user is authenticated and belongs to the company", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);
    const user = makeUser({ companyId: company.id });
    await inMemoryUsersRepository.create(user);

    const attachment = makeAttachment({
      companyId: company.id,
      userId: user.id,
    });
    await inMemoryAttachmentsRepository.create(attachment);

    const result = await sut.execute({
      companyId: company.id.toString(),
      id: attachment.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.attachment.id).toEqual(attachment.id);
    }
  });

  it("should return UserNotBelongToCompanyError if user does not belong to the company", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const attachment = makeAttachment();
    await inMemoryAttachmentsRepository.create(attachment);

    const result = await sut.execute({
      id: attachment.id.toString(),
      companyId: "another-company-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
