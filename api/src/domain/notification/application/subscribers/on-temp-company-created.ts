import { DomainEvents } from "@/core/events/domain-events";
import { TempCompanyCreatedEvent } from "@/domain/user/enterprise/events/temp-company-created.event";
import { SendEmailUseCase } from "../use-cases/send-email";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnTempCompanyCreated {
  constructor(private sendEmail: SendEmailUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendWelcomeEmail.bind(this),
      TempCompanyCreatedEvent.name
    );
  }

  private async sendWelcomeEmail(event: unknown) {
    const tempCompanyCreatedEvent = event as TempCompanyCreatedEvent;
    const { tempCompany } = tempCompanyCreatedEvent;

    await this.sendEmail.execute({
      to: tempCompany.email,
      subject: "Bem-vindo ao Sistema de Controle de Vendas",
      body: `
        Olá ${tempCompany.userName},

        Seu cadastro temporário foi criado com sucesso!

        Para acessar o sistema, utilize o token abaixo:
        ${tempCompany.token}

        Este token é válido até ${tempCompany.expiration.toLocaleString()}.

        Atenciosamente,
        Equipe de Controle de Vendas
      `,
    });
  }
}
