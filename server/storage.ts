import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

function normalizeKey(relKey: string): string {
  const normalized = relKey.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!normalized || normalized.split("/").includes("..")) {
    throw new Error("Invalid storage key");
  }
  return normalized;
}

function getStorage() {
  if (!ENV.s3Bucket) throw new Error("S3_BUCKET is not configured");
  return {
    bucket: ENV.s3Bucket,
    client: new S3Client({
      region: ENV.s3Region,
      ...(ENV.s3Endpoint ? { endpoint: ENV.s3Endpoint, forcePathStyle: true } : {}),
    }),
  };
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const { bucket, client } = getStorage();
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: contentType,
  }));
  const publicBase = ENV.s3PublicUrl.replace(/\/$/, "");
  return {
    key,
    url: publicBase ? `${publicBase}/${key}` : (await storageGet(key)).url,
  };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const publicBase = ENV.s3PublicUrl.replace(/\/$/, "");
  if (publicBase) return { key, url: `${publicBase}/${key}` };
  const { bucket, client } = getStorage();
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
  return { key, url };
}
