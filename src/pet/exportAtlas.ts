import { buildCodexAtlasCanvas } from "./atlas";
import type { EditableAnimation, ExportFormat } from "./types";

export async function exportCodexAtlas(
  format: ExportFormat,
  states: readonly EditableAnimation[],
  sourceFrames: HTMLImageElement,
): Promise<string> {
  const canvas = buildCodexAtlasCanvas(states, sourceFrames);
  const mime = format === "png" ? "image/png" : "image/webp";
  const suggestedName = `esheep64-spritesheet.${format}`;
  const blob = await canvasToBlob(canvas, mime, format === "webp" ? 1 : undefined);

  saveBlob(blob, suggestedName);

  return `Exported ${format.toUpperCase()}, ${canvas.width} x ${canvas.height}, ${Math.round(
    blob.size / 1024,
  )} KB`;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error(`Could not encode ${type}`));
        }
      },
      type,
      quality,
    );
  });
}

function saveBlob(blob: Blob, suggestedName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
