import { Email } from "../../enterprise/entities/email";

export abstract class EmailsRepository {
  abstract create(email: Email): Promise<void>;
  abstract findById(id: string): Promise<Email | null>;
  abstract save(email: Email): Promise<void>;
}
