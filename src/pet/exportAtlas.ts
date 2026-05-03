import { buildCodexAtlasCanvas } from "./atlas";
import { saveBlob } from "./saveFile";
import type { EditableAnimation } from "./types";

export async function exportCodexAtlas(
  states: readonly EditableAnimation[],
  sourceFrames: HTMLImageElement,
): Promise<string> {
  const canvas = buildCodexAtlasCanvas(states, sourceFrames);
  const blob = await canvasToBlob(canvas, "image/webp", 1);

  const saveResult = await saveBlob(blob, {
    suggestedName: "spritesheet.webp",
    mimeType: "image/webp",
    extensions: [".webp"],
    description: "WEBP image",
  });

  if (saveResult === "cancelled") {
    return "WEBP export cancelled";
  }

  return `Exported WEBP, ${canvas.width} x ${canvas.height}, ${Math.round(
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
