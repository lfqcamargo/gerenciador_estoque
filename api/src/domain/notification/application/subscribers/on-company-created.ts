import { DomainEvents } from "@/core/events/domain-events";
import { CompanyCreatedEvent } from "@/domain/user/enterprise/events/company-created.event";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";

export class OnCompanyCreated {
  constructor(private tempUsersRepository: TempUsersRepository) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.deleteTempUser.bind(this),
      CompanyCreatedEvent.name
    );
  }

  private async deleteTempUser(event: unknown) {
    const companyCreatedEvent = event as CompanyCreatedEvent;
    const { company } = companyCreatedEvent;

    const tempUser = await this.tempUsersRepository.findByCnpj(company.cnpj);

    if (!tempUser) {
      return;
    }

    await this.tempUsersRepository.delete(tempUser.id.toString());
  }
}
