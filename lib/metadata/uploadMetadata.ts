import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadMetadata(
  tokenId: number,
  metadata: Record<string, unknown>
): Promise<void> {
  const folderName =
    process.env.NEXT_PUBLIC_NETWORK === "root"
      ? "poapfv2024"
      : "poapfv2024-testnet";
  const Key = `${folderName}/${tokenId}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key,
    Body: JSON.stringify(metadata),
    ContentType: "application/json",
  });

  await s3.send(command);
}
