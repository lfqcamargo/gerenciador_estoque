import { AttachmentsRepository } from "@/domain/shared/application/repositories/attachments-repository";
import { Attachment } from "@/domain/shared/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }

  async findById(id: string) {
    const attachment = this.items.find((item) => item.id.toString() === id);
    return attachment ?? null;
  }

  async delete(id: string) {
    const attachmentIndex = this.items.findIndex(
      (item) => item.id.toString() === id
    );
    this.items.splice(attachmentIndex, 1);
  }
}
