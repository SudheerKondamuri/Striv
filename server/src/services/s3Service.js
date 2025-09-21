import { getS3Client } from "../config/s3.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = getS3Client();
const bucketName = process.env.S3_BUCKET;

export async function getUploadUrl(fileName, fileType) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    ContentType: fileType,
  });

  const url = await s3.getSignedUrl(command, { expiresIn: 3600 }); // 1 hour
  return url;
}

export async function getDownloadUrl(fileName) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const url = await s3.getSignedUrl(command, { expiresIn: 3600 }); // 1 hour
  return url;
}
