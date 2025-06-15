import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface AttachmentProps {
  title: string;
  url: string;

  companyId: UniqueEntityID;
  userId: UniqueEntityID;
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }

  get companyId() {
    return this.props.companyId;
  }

  get userId() {
    return this.props.userId;
  }

  set companyId(companyId: UniqueEntityID) {
    this.props.companyId = companyId;
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId;
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
