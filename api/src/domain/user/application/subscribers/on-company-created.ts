import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { CompanyCreatedEvent } from "../../enterprise/events/company-created.event";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { TempCompaniesRepository } from "../repositories/temp-companies-repository";
import { CompaniesRepository } from "../repositories/companies-repository";

@Injectable()
export class OnCompanyCreated implements EventHandler, OnModuleInit {
  constructor(
    private tempCompaniesRepository: TempCompaniesRepository,
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

    const tempCompany = await this.tempCompaniesRepository.findByCnpj(
      company.cnpj
    );

    if (tempCompany) {
      await this.tempCompaniesRepository.delete(tempCompany);
    }
  }
}
