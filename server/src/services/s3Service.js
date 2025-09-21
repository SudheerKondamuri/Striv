import { getS3Client } from "../config/s3.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3ClientInstance = null;
let s3BucketName = null;

function initializeS3() {
  if (!s3ClientInstance) {
    s3ClientInstance = getS3Client();
    s3BucketName = process.env.S3_BUCKET;
  }
}

export async function getUploadUrl(fileName, fileType) {
  initializeS3(); // Ensure S3 client is initialized
  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: fileName,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3ClientInstance, command, { expiresIn: 3600 }); // 1 hour
  return url;
}

export async function getDownloadUrl(fileName) {
  initializeS3(); // Ensure S3 client is initialized
  const command = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: fileName,
  });

  const url = await getSignedUrl(s3ClientInstance, command, { expiresIn: 3600 }); // 1 hour
  return url;
}