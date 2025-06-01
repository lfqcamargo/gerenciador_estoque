import { InMemoryTempUsersRepository } from "test/repositories/in-memory-temp-users-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DomainEvents } from "@/core/events/domain-events";
import { describe, it, beforeEach, expect } from "vitest";
import { OnCompanyCreated } from "./on-company-created";
import { makeTempUser } from "test/factories/make-temp-user";
import { Company } from "../../enterprise/entities/company";

let inMemoryTempUsersRepository: InMemoryTempUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("On Company Created", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryTempUsersRepository = new InMemoryTempUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempUsersRepository,
      inMemoryUsersRepository
    );

    // Limpa os handlers de eventos anteriores
    DomainEvents.clearHandlers();
  });

  it("should delete temporary user when company is created", async () => {
    // Registra o subscriber
    new OnCompanyCreated(
      inMemoryTempUsersRepository,
      inMemoryCompaniesRepository
    );

    // Cria um usuário temporário
    const tempUser = makeTempUser({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@example.com",
      userName: "John Doe",
    });

    await inMemoryTempUsersRepository.create(tempUser);

    // Cria uma company com o mesmo CNPJ
    const company = Company.create({
      cnpj: tempUser.cnpj,
      name: tempUser.companyName,
    });

    await inMemoryCompaniesRepository.create(company);

    // Dispara o evento
    DomainEvents.dispatchEventsForAggregate(company.id);

    // Verifica se o usuário temporário foi deletado
    const deletedTempUser = await inMemoryTempUsersRepository.findByCnpj(
      tempUser.cnpj
    );
    expect(deletedTempUser).toBeNull();
  });

  it("should not throw error when temporary user does not exist", async () => {
    // Registra o subscriber
    new OnCompanyCreated(
      inMemoryTempUsersRepository,
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
