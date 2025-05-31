import { DomainEvents } from "@/core/events/domain-events";
import { PasswordTokenCreatedEvent } from "@/domain/user/enterprise/events/password-token-created.event";
import { SendEmailUseCase } from "../use-cases/send-email";

export class OnPasswordTokenCreated {
  constructor(private sendEmail: SendEmailUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendPasswordResetEmail.bind(this),
      PasswordTokenCreatedEvent.name
    );
  }

  private async sendPasswordResetEmail(event: unknown) {
    const passwordTokenCreatedEvent = event as PasswordTokenCreatedEvent;
    const { passwordToken, user } = passwordTokenCreatedEvent;

    await this.sendEmail.execute({
      to: user.email,
      subject: "Recuperação de Senha",
      body: `
        Olá ${user.name},

        Você solicitou a recuperação de senha da sua conta.

        Para criar uma nova senha, utilize o token abaixo:
        ${passwordToken.token}

        Este token é válido até ${passwordToken.expiration.toLocaleString()}.

        Se você não solicitou esta recuperação de senha, ignore este email.

        Atenciosamente,
        Equipe de Controle de Vendas
      `,
    });
  }
}
