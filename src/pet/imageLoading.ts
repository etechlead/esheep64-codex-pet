import type { ImageLoadState } from "./types";

export function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject(new Error(`Could not load ${path}`)), {
      once: true,
    });
    image.src = path;
  });
}

export async function loadSourceFrames(sourceFramesPath: string): Promise<ImageLoadState> {
  try {
    const sourceFrames = await loadImage(sourceFramesPath);
    return { status: "ready", sourceFrames };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "Source frames failed to load",
    };
  }
}
