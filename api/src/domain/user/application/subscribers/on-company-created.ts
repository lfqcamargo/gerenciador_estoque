import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { CompanyCreatedEvent } from "../../enterprise/events/company-created.event";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { TempUsersRepository } from "../repositories/temp-users-repository";
import { CompaniesRepository } from "../repositories/companies-repository";

@Injectable()
export class OnCompanyCreated implements EventHandler, OnModuleInit {
  constructor(
    private tempUsersRepository: TempUsersRepository,
    private companiesRepository: CompaniesRepository
  ) {}

  onModuleInit() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.deleteTemporaryUser.bind(this),
      CompanyCreatedEvent.name
    );
  }

  private async deleteTemporaryUser(event: unknown): Promise<void> {
    const companyCreatedEvent = event as CompanyCreatedEvent;
    const company = await this.companiesRepository.findById(
      companyCreatedEvent.company.id.toString()
    );

    if (!company) {
      return;
    }

    const tempUser = await this.tempUsersRepository.findByCnpj(company.cnpj);

    if (tempUser) {
      await this.tempUsersRepository.delete(tempUser);
    }
  }
}
