/**
 * Storage con Cloudinary (sostituisce Manus S3)
 *
 * Cloudinary gestisce upload, ottimizzazione e CDN delle immagini.
 * Free tier: 25GB/mese, sufficiente per un sito di una dietista.
 */
import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./_core/env";

// Configura Cloudinary con le credenziali dall'env
cloudinary.config({
  cloud_name: ENV.cloudinaryCloudName,
  api_key: ENV.cloudinaryApiKey,
  api_secret: ENV.cloudinaryApiSecret,
  secure: true,
});

/**
 * Carica un file su Cloudinary
 * @param relKey - Percorso relativo del file (es. "user-123/photo.jpg")
 * @param data - Buffer, Uint8Array o stringa base64
 * @param contentType - MIME type del file (es. "image/jpeg")
 * @returns { key, url } - Chiave e URL pubblico del file
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType?: string
): Promise<{ key: string; url: string }> {
  // Converti il buffer in base64 data URI per Cloudinary
  let uploadData: string;
  if (typeof data === "string") {
    uploadData = data;
  } else {
    const base64 = Buffer.from(data).toString("base64");
    const mimeType = contentType || "application/octet-stream";
    uploadData = `data:${mimeType};base64,${base64}`;
  }

  // Usa il relKey come public_id (rimuovi estensione, normalizza caratteri)
  const publicId = relKey.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9/_-]/g, "_");

  const result = await cloudinary.uploader.upload(uploadData, {
    public_id: publicId,
    resource_type: "auto",
    overwrite: true,
  });

  return {
    key: result.public_id,
    url: result.secure_url,
  };
}

/**
 * Ottieni l'URL di un file su Cloudinary
 * @param relKey - Chiave del file (public_id Cloudinary)
 * @param _expiresIn - Non usato con Cloudinary (URL pubblici permanenti)
 * @returns { key, url } - Chiave e URL pubblico del file
 */
export async function storageGet(
  relKey: string,
  _expiresIn?: number
): Promise<{ key: string; url: string }> {
  const url = cloudinary.url(relKey, { secure: true });
  return { key: relKey, url };
}

/**
 * Elimina un file da Cloudinary
 * @param relKey - Chiave del file (public_id Cloudinary)
 */
export async function storageDelete(relKey: string): Promise<void> {
  await cloudinary.uploader.destroy(relKey);
}
