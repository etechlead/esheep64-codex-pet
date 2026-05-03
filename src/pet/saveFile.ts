type SavePickerFileType = {
  readonly description: string;
  readonly accept: Record<string, readonly string[]>;
};

type SavePickerOptions = {
  readonly suggestedName: string;
  readonly types: readonly SavePickerFileType[];
};

type WritableFileStream = {
  readonly write: (data: Blob) => Promise<void>;
  readonly close: () => Promise<void>;
};

type FileHandle = {
  readonly createWritable: () => Promise<WritableFileStream>;
};

type WindowWithSavePicker = Window & {
  readonly showSaveFilePicker?: (options: SavePickerOptions) => Promise<FileHandle>;
};

export type SaveFileOptions = {
  readonly suggestedName: string;
  readonly mimeType: string;
  readonly extensions: readonly string[];
  readonly description: string;
};

export type SaveFileResult = "saved" | "downloaded" | "cancelled";

export async function saveUrl(
  url: string,
  options: SaveFileOptions,
): Promise<SaveFileResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${options.suggestedName}`);
  }
  const blob = await response.blob();
  return saveBlob(blob, options);
}

export async function saveBlob(
  blob: Blob,
  options: SaveFileOptions,
): Promise<SaveFileResult> {
  const savePicker = (window as WindowWithSavePicker).showSaveFilePicker;

  if (savePicker && window.isSecureContext) {
    try {
      const handle = await savePicker({
        suggestedName: options.suggestedName,
        types: [
          {
            description: options.description,
            accept: {
              [options.mimeType]: options.extensions,
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return "saved";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
      throw error;
    }
  }

  saveBlobAsDownload(blob, options.suggestedName);
  return "downloaded";
}

function saveBlobAsDownload(blob: Blob, suggestedName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
