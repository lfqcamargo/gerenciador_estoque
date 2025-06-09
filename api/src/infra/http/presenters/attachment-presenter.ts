import { Attachment } from "@/domain/shared/enterprise/entities/attachment";

export class AttachmentPresenter {
  static toHTTP(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
      companyId: attachment.companyId.toString(),
      userId: attachment.userId.toString(),
    };
  }
}
