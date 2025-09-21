import { S3Client } from "@aws-sdk/client-s3";

export function getS3Client() {
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.error("S3 ENV VARS MISSING:", { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY });
    throw new Error("Missing AWS S3 environment variables");
  }

  return new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });
}
