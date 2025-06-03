import { PasswordToken } from "../../enterprise/entities/passwordToken";

export abstract class PasswordTokensRepository {
  abstract create(data: PasswordToken): Promise<void>;
  abstract findByToken(token: string): Promise<PasswordToken | null>;
  abstract deleteByToken(token: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
}
