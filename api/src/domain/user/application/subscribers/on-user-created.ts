import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { TempUsersRepository } from "../repositories/temp-users-repository";
import { UsersRepository } from "../repositories/users-repository";
import { UserCreatedEvent } from "../../enterprise/events/user-created.event";

@Injectable()
export class OnUserCreated implements EventHandler, OnModuleInit {
  constructor(
    private tempUsersRepository: TempUsersRepository,
    private usersRepository: UsersRepository
  ) {}

  onModuleInit() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.deleteTemporaryUser.bind(this),
      UserCreatedEvent.name
    );
  }

  private async deleteTemporaryUser(event: unknown): Promise<void> {
    const userCreatedEvent = event as UserCreatedEvent;
    const user = await this.usersRepository.findById(
      userCreatedEvent.user.id.toString()
    );

    if (!user) {
      return;
    }

    const tempUser = await this.tempUsersRepository.findByEmail(user.email);

    if (tempUser) {
      await this.tempUsersRepository.delete(tempUser);
    }
  }
}
