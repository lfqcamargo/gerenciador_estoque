import { EmailsRepository } from "@/domain/notification/application/repositories/emails-repository";
import { Email } from "@/domain/notification/enterprise/entities/email";

export class InMemoryEmailsRepository implements EmailsRepository {
  public items: Email[] = [];

  async create(email: Email): Promise<void> {
    this.items.push(email);
  }

  async findById(id: string): Promise<Email | null> {
    const email = this.items.find((item) => item.id.toString() === id);

    if (!email) {
      return null;
    }

    return email;
  }

  async save(email: Email): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === email.id);

    this.items[itemIndex] = email;
  }
}
