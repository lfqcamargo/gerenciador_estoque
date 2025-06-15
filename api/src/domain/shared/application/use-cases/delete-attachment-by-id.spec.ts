import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { makeCompany } from "test/factories/make-company";
import { makeUser } from "test/factories/make-user";
import { Attachment } from "@/domain/shared/enterprise/entities/attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { DeleteAttachmentUseCase } from "./delete-attachment-by-id";
import { AttachmentNotFoundError } from "./errors/attachment-not-found-error";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let fakeUploader: FakeUploader;
let sut: DeleteAttachmentUseCase;

describe("Delete attachment by id   ", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository
    );
    fakeUploader = new FakeUploader();
    sut = new DeleteAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
      inMemoryUsersRepository,
      inMemoryCompaniesRepository
    );
  });

  it("should delete an attachment successfully", async () => {
    const company = makeCompany();
    const user = makeUser({ companyId: company.id });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryUsersRepository.create(user);

    const attachment = Attachment.create({
      title: "logo.png",
      url: "1234-logo.png",
      companyId: company.id,
      userId: user.id,
    });

    await inMemoryAttachmentsRepository.create(attachment);

    const result = await sut.execute({
      attachmentId: attachment.id.toString(),
      companyId: company.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAttachmentsRepository.items).toHaveLength(0);
    expect(fakeUploader.uploads).toHaveLength(0);
  });

  it("should return error if attachment does not exist", async () => {
    const company = makeCompany();
    const user = makeUser({ companyId: company.id });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      attachmentId: "non-existent",
      companyId: company.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AttachmentNotFoundError);
  });

  it("should return error if user does not belong to the company", async () => {
    const company = makeCompany();
    const otherCompany = makeCompany();
    const user = makeUser({ companyId: otherCompany.id });

    const attachment = Attachment.create({
      title: "file.pdf",
      url: "file.pdf",
      companyId: company.id,
      userId: user.id,
    });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryCompaniesRepository.create(otherCompany);
    await inMemoryUsersRepository.create(user);
    await inMemoryAttachmentsRepository.create(attachment);

    const result = await sut.execute({
      attachmentId: attachment.id.toString(),
      companyId: company.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });

  it("should return error if company does not exist", async () => {
    const user = makeUser({ companyId: new UniqueEntityID("company-1") });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      attachmentId: "attachment-1",
      companyId: "company-1",
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });

  it("should return error if user does not exist", async () => {
    const company = makeCompany();

    await inMemoryCompaniesRepository.create(company);

    const result = await sut.execute({
      attachmentId: "attachment-1",
      companyId: company.id.toString(),
      userId: "non-existent-user",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
