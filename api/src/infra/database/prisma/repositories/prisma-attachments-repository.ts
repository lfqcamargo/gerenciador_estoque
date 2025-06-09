import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AttachmentsRepository } from "@/domain/shared/application/repositories/attachments-repository";
import { Attachment } from "@/domain/shared/enterprise/entities/attachment";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });
    return attachment ? PrismaAttachmentMapper.toDomain(attachment) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id },
    });
  }
}
