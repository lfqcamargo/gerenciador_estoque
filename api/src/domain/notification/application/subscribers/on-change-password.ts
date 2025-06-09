import { DomainEvents } from "@/core/events/domain-events";
import { PasswordChangeEvent } from "@/domain/user/enterprise/events/password-change.event";
import { SendEmailUseCase } from "../use-cases/send-email";
import { Injectable } from "@nestjs/common";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";

@Injectable()
export class OnChangePassword {
  constructor(
    private sendEmail: SendEmailUseCase,
    private passwordTokensRepository: PasswordTokensRepository
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendPasswordChangeEmail.bind(this),
      PasswordChangeEvent.name
    );
  }

  private async sendPasswordChangeEmail(event: unknown) {
    const passwordChangeEvent = event as PasswordChangeEvent;
    const { user } = passwordChangeEvent;

    await this.passwordTokensRepository.deleteByUserId(user.id.toString());

    await this.sendEmail.execute({
      to: user.email,
      subject: "Senha alterada com sucesso",
      body: `
        Olá ${user.name},
      `,
    });
  }
}
