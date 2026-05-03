import {
  atlasColumns,
  atlasRows,
  cellHeight,
  cellWidth,
  sourceColumns,
  sourceFrameHeight,
  sourceFrameWidth,
  sourceScale,
  spriteTop,
} from "./petData";
import type { EditableAnimation } from "./types";

export type SourceRect = {
  readonly x: number;
  readonly y: number;
};

export function sourceRect(frameId: number): SourceRect {
  return {
    x: (frameId % sourceColumns) * sourceFrameWidth,
    y: Math.floor(frameId / sourceColumns) * sourceFrameHeight,
  };
}

export function totalSourceFrames(sourceFrames: HTMLImageElement): number {
  return (
    (sourceFrames.naturalWidth / sourceFrameWidth) *
    (sourceFrames.naturalHeight / sourceFrameHeight)
  );
}

export function drawSourceFrame(
  target: CanvasRenderingContext2D,
  sourceFrames: HTMLImageElement,
  frameId: number,
): void {
  target.clearRect(0, 0, sourceFrameWidth, sourceFrameHeight);
  target.imageSmoothingEnabled = false;
  const rect = sourceRect(frameId);
  target.drawImage(
    sourceFrames,
    rect.x,
    rect.y,
    sourceFrameWidth,
    sourceFrameHeight,
    0,
    0,
    sourceFrameWidth,
    sourceFrameHeight,
  );
}

export function drawCodexCell(
  target: CanvasRenderingContext2D,
  sourceFrames: HTMLImageElement,
  state: EditableAnimation,
  column: number,
): void {
  target.clearRect(0, 0, cellWidth, cellHeight);
  target.imageSmoothingEnabled = false;

  const frameId = state.sourceFrames[column];
  const maxFrame = totalSourceFrames(sourceFrames) - 1;
  if (!Number.isInteger(frameId) || frameId < 0 || frameId > maxFrame) {
    drawInvalidCell(target, frameId);
    return;
  }

  const rect = sourceRect(frameId);
  const scaledWidth = sourceFrameWidth * sourceScale;
  const scaledHeight = sourceFrameHeight * sourceScale;
  const offset = state.offsets[column] ?? [0, 0];
  const left = (cellWidth - scaledWidth) / 2 + offset[0];
  const top = spriteTop + offset[1];

  target.save();
  if (state.mirror) {
    target.translate(cellWidth, 0);
    target.scale(-1, 1);
  }
  target.drawImage(
    sourceFrames,
    rect.x,
    rect.y,
    sourceFrameWidth,
    sourceFrameHeight,
    left,
    top,
    scaledWidth,
    scaledHeight,
  );
  target.restore();
}

export function buildCodexAtlasCanvas(
  states: readonly EditableAnimation[],
  sourceFrames: HTMLImageElement,
): HTMLCanvasElement {
  const output = document.createElement("canvas");
  output.width = cellWidth * atlasColumns;
  output.height = cellHeight * atlasRows;

  const target = getCanvasContext(output);
  target.clearRect(0, 0, output.width, output.height);
  target.imageSmoothingEnabled = false;

  for (const state of states) {
    for (let column = 0; column < state.sourceFrames.length; column += 1) {
      target.save();
      target.translate(column * cellWidth, state.row * cellHeight);
      drawCodexCell(target, sourceFrames, state, column);
      target.restore();
    }
  }

  return output;
}

export function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const target = canvas.getContext("2d");
  if (!target) {
    throw new Error("2D canvas context is unavailable");
  }
  return target;
}

function drawInvalidCell(target: CanvasRenderingContext2D, frameId: number): void {
  target.fillStyle = "#fff2f1";
  target.fillRect(0, 0, cellWidth, cellHeight);
  target.fillStyle = "#a32018";
  target.font = "14px ui-sans-serif, system-ui, sans-serif";
  target.fillText(`bad frame: ${String(frameId)}`, 14, 30);
}
