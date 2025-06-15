import { Prisma, Attachment as PrismaAttachment } from "generated/prisma";
import { Attachment } from "@/domain/shared/enterprise/entities/attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
        companyId: new UniqueEntityID(raw.companyId),
        userId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    attachment: Attachment
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
      companyId: attachment.companyId.toString(),
      userId: attachment.userId.toString(),
    };
  }
}
