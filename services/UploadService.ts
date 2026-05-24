import cloudinary from "../lib/cloudinary";

export interface UploadResult {
    fileUrl: string;
    publicId: string;
    mimeType: string;
    size: number;
}

/**
 * Uploads a base64-encoded file to Cloudinary.
 * The frontend should send: { data: "data:application/pdf;base64,JVBERi...", filename: "notes.pdf" }
 */
export async function uploadFile(
    base64Data: string,
    filename: string
): Promise<UploadResult> {
    const result = await cloudinary.uploader.upload(base64Data, {
        resource_type: "raw",          // handles PDFs, docs, etc.
        public_id: `booknest/${Date.now()}_${filename.replace(/\s+/g, "_")}`,
        overwrite: false,
    });

    return {
        fileUrl:  result.secure_url,
        publicId: result.public_id,
        mimeType: result.format ?? "application/octet-stream",
        size:     result.bytes,
    };
}

/**
 * Deletes a file from Cloudinary by its public_id.
 * Called when a resource is deleted from the DB.
 */
export async function deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}