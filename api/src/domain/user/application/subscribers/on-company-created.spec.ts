import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DomainEvents } from "@/core/events/domain-events";
import { describe, it, beforeEach, expect } from "vitest";
import { OnCompanyCreated } from "./on-company-created";
import { makeTempCompany } from "test/factories/make-temp-company";
import { Company } from "../../enterprise/entities/company";

let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("On Company Created", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository
    );

    // Limpa os handlers de eventos anteriores
    DomainEvents.clearHandlers();
  });

  it("should delete temporary user when company is created", async () => {
    // Registra o subscriber
    new OnCompanyCreated(
      inMemoryTempCompaniesRepository,
      inMemoryCompaniesRepository
    );

    // Cria um usuário temporário
    const tempUser = makeTempCompany({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@example.com",
      userName: "John Doe",
    });

    await inMemoryTempCompaniesRepository.create(tempUser);

    // Cria uma company com o mesmo CNPJ
    const company = Company.create({
      cnpj: tempUser.cnpj,
      name: tempUser.companyName,
    });

    await inMemoryCompaniesRepository.create(company);

    // Dispara o evento
    DomainEvents.dispatchEventsForAggregate(company.id);

    // Verifica se o usuário temporário foi deletado
    const deletedTempUser = await inMemoryTempCompaniesRepository.findByCnpj(
      tempUser.cnpj
    );
    expect(deletedTempUser).toBeNull();
  });

  it("should not throw error when temporary user does not exist", async () => {
    // Registra o subscriber
    new OnCompanyCreated(
      inMemoryTempCompaniesRepository,
      inMemoryCompaniesRepository
    );

    // Cria uma company sem usuário temporário correspondente
    const company = Company.create({
      cnpj: "12345678901234",
      name: "Test Company",
    });

    await inMemoryCompaniesRepository.create(company);

    // Dispara o evento
    await expect(async () => {
      DomainEvents.dispatchEventsForAggregate(company.id);
    }).not.toThrow();
  });
});
