import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryTempUsersRepository } from "test/repositories/in-memory-temp-users-repository";
import { makeUser } from "test/factories/make-user";
import { makeCompany } from "test/factories/make-company";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";
import { CompanyNotFoundError } from "@/domain/user/application/use-cases/errors/company-not-found-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryTempUsersRepository: InMemoryTempUsersRepository;

let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryTempUsersRepository = new InMemoryTempUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempUsersRepository,
      inMemoryUsersRepository
    );
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
      inMemoryCompaniesRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const company = makeCompany();
    const user = makeUser({
      companyId: company.id.toString(),
    });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
      companyId: company.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      })
    );
  });

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "profile.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
      companyId: "company-1",
      userId: "user-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });

  it("should not be able to upload an attachment if user does not belong to company", async () => {
    const company = makeCompany();
    const user = makeUser({
      companyId: "company-2",
    });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
      companyId: company.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });

  it("should not be able to upload an attachment if company does not exist", async () => {
    const user = makeUser({
      companyId: "company-1",
    });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
      companyId: "company-1",
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });

  it("should not be able to upload an attachment if user does not exist", async () => {
    const company = makeCompany();
    const user = makeUser({
      companyId: company.id.toString(),
    });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryUsersRepository.create(user);
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
      companyId: company.id.toString(),
      userId: "user-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
