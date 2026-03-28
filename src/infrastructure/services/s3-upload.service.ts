import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../common/libraries/s3";
import { S3_BUCKET_NAME, S3_ENDPOINT } from "../../common/configs/env.config";

export class S3UploadService {
  static async uploadImage(file: File): Promise<string> {
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const imageUrl = `${S3_ENDPOINT}/${S3_BUCKET_NAME}/${fileName}`;
    return imageUrl;
  }

  static async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}
