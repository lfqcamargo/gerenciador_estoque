import {
  UploadParams,
  Uploader,
} from "@/domain/shared/application/storage/uploader";
import { randomUUID } from "crypto";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }

  async delete(key: string): Promise<void> {
    const uploadIndex = this.uploads.findIndex((upload) => upload.url === key);
    this.uploads.splice(uploadIndex, 1);
  }
}
