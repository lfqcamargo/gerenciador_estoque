import { Email as PrismaEmail } from "generated/prisma";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaEmailMapper {
  static toDomain(raw: PrismaEmail): Email {
    return Email.create(
      {
        to: raw.to,
        subject: raw.subject,
        body: raw.body,
        from: raw.from ?? undefined,
        createdAt: new Date(raw.createdAt),
        sentAt: raw.sentAt ? new Date(raw.sentAt) : undefined,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(email: Email) {
    return {
      id: email.id.toString(),
      to: email.to,
      subject: email.subject,
      body: email.body,
      from: email.from ?? null,
      createdAt: email.createdAt,
      sentAt: email.sentAt ?? null,
    };
  }
}
