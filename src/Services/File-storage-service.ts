import { getSupabaseClient } from "../lib/supabase";

const STORAGE_BUCKET = "simonium-files";

export interface StoredFile {
  name: string;
  id: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  size: number | null;
  contentType: string | null;
}

function getStorage() {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      "SIMONIUM storage is unavailable. Check your Supabase configuration.",
    );
  }

  return client.storage.from(STORAGE_BUCKET);
}

function validateFile(file: File): void {
  if (!(file instanceof File)) {
    throw new Error("Please select a valid file.");
  }

  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  // Prevent unexpectedly large uploads.
  const maximumSize = 10 * 1024 * 1024;

  if (file.size > maximumSize) {
    throw new Error("The file must not exceed 10 MB.");
  }

  if (!file.name.trim()) {
    throw new Error("The file must have a name.");
  }
}

function validatePath(path: string): string {
  const normalizedPath = path.trim();

  if (!normalizedPath || normalizedPath.startsWith("/")) {
    throw new Error("Please provide a valid storage path.");
  }

  if (
    normalizedPath.includes("..") ||
    normalizedPath.includes("\\")
  ) {
    throw new Error("The storage path is invalid.");
  }

  return normalizedPath;
}

/**
 * Upload a file to SIMONIUM storage.
 *
 * The destination path should include a user-specific folder,
 * for example: user-id/reports/report.pdf.
 */
export async function uploadFile(
  path: string,
  file: File,
): Promise<StoredFile> {
  validateFile(file);

  const safePath = validatePath(path);
  const storage = getStorage();

  const { data, error } = await storage.upload(
    safePath,
    file,
    {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    },
  );

  if (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }

  return {
    name: data.path.split("/").pop() ?? data.path,
    id: null,
    updatedAt: null,
    createdAt: null,
    size: file.size,
    contentType: file.type || null,
  };
}

/**
 * List files in a storage folder.
 */
export async function listFiles(
  folder = "",
): Promise<StoredFile[]> {
  const safeFolder = folder ? validatePath(folder) : "";
  const storage = getStorage();

  const { data, error } = await storage.list(safeFolder, {
    limit: 100,
    sortBy: {
      column: "name",
      order: "asc",
    },
  });

  if (error) {
    throw new Error(`Unable to list files: ${error.message}`);
  }

  return (data ?? []).map((file) => ({
    name: file.name,
    id: file.id ?? null,
    updatedAt: file.updated_at ?? null,
    createdAt: file.created_at ?? null,
    size: file.metadata?.size ?? null,
    contentType: file.metadata?.mimetype ?? null,
  }));
}

/**
 * Generate a temporary download URL.
 */
export async function getFileDownloadUrl(
  path: string,
  expiresInSeconds = 60,
): Promise<string> {
  const safePath = validatePath(path);

  if (
    !Number.isInteger(expiresInSeconds) ||
    expiresInSeconds < 1 ||
    expiresInSeconds > 3600
  ) {
    throw new Error(
      "The download link expiration must be between 1 and 3600 seconds.",
    );
  }

  const storage = getStorage();

  const { data, error } = await storage.createSignedUrl(
    safePath,
    expiresInSeconds,
  );

  if (error) {
    throw new Error(`Unable to create download link: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(
  path: string,
): Promise<void> {
  const safePath = validatePath(path);
  const storage = getStorage();

  const { error } = await storage.remove([safePath]);

  if (error) {
    throw new Error(`Unable to delete file: ${error.message}`);
  }
}
