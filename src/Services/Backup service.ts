export interface BackupEnvelope<T> {
  appName: string;
  version: number;
  createdAt: string;
  data: T;
}

const BACKUP_APP_NAME = "SIMONIUM";
const BACKUP_VERSION = 1;

/**
 * Create a downloadable JSON backup.
 */
export function createBackup<T>(data: T): BackupEnvelope<T> {
  return {
    appName: BACKUP_APP_NAME,
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    data,
  };
}

/**
 * Download backup data as a JSON file.
 */
export function downloadBackup<T>(
  data: T,
  filename = "simonium-backup.json",
): void {
  if (typeof window === "undefined") {
    throw new Error("Backup download is only available in a browser.");
  }

  const backup = createBackup(data);
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

/**
 * Read and validate a JSON backup file.
 */
export async function readBackupFile<T>(
  file: File,
): Promise<BackupEnvelope<T>> {
  if (!file.name.toLowerCase().endsWith(".json")) {
    throw new Error("Please select a JSON backup file.");
  }

  const text = await file.text();

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("appName" in parsed) ||
    !("version" in parsed) ||
    !("createdAt" in parsed) ||
    !("data" in parsed)
  ) {
    throw new Error("The backup file has an invalid structure.");
  }

  const backup = parsed as BackupEnvelope<T>;

  if (backup.appName !== BACKUP_APP_NAME) {
    throw new Error("This backup does not belong to SIMONIUM.");
  }

  if (backup.version !== BACKUP_VERSION) {
    throw new Error("This backup version is not supported.");
  }

  if (
    typeof backup.createdAt !== "string" ||
    Number.isNaN(Date.parse(backup.createdAt))
  ) {
    throw new Error("The backup creation date is invalid.");
  }

  return backup;
}

/**
 * Restore the data contained in a validated backup.
 *
 * The caller must decide how to validate and save the returned data.
 * This function does not overwrite database records automatically.
 */
export async function restoreBackup<T>(
  file: File,
): Promise<T> {
  const backup = await readBackupFile<T>(file);
  return backup.data;
}
