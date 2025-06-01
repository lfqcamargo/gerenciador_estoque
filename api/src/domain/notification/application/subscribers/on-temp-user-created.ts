import { DomainEvents } from "@/core/events/domain-events";
import { TempUserCreatedEvent } from "@/domain/user/enterprise/events/temp-user-created.event";
import { SendEmailUseCase } from "../use-cases/send-email";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnTempUserCreated {
  constructor(private sendEmail: SendEmailUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendWelcomeEmail.bind(this),
      TempUserCreatedEvent.name
    );
  }

  private async sendWelcomeEmail(event: unknown) {
    const tempUserCreatedEvent = event as TempUserCreatedEvent;
    const { tempUser } = tempUserCreatedEvent;

    await this.sendEmail.execute({
      to: tempUser.email,
      subject: "Bem-vindo ao Sistema de Controle de Vendas",
      body: `
        Olá ${tempUser.userName},

        Seu cadastro temporário foi criado com sucesso!

        Para acessar o sistema, utilize o token abaixo:
        ${tempUser.token}

        Este token é válido até ${tempUser.expiration.toLocaleString()}.

        Atenciosamente,
        Equipe de Controle de Vendas
      `,
    });
  }
}
