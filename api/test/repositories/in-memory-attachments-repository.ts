import { AttachmentsRepository } from "@/domain/shared/application/repositories/attachments-repository";
import { Attachment } from "@/domain/shared/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
