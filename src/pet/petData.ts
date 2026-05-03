import type { AnimationSpec, EditableAnimation, Offset } from "./types";

export const sourceFramesPath = `${import.meta.env.BASE_URL}esheep64-codex/source/source-frames.png`;

export const cellWidth = 192;
export const cellHeight = 208;
export const atlasColumns = 8;
export const atlasRows = 9;
export const sourceColumns = 16;
export const sourceFrameWidth = 40;
export const sourceFrameHeight = 40;
export const sourceScale = 4;
export const spriteTop = 24;

export const animationSpecs = [
  {
    name: "idle",
    row: 0,
    sourceFrames: [8, 7, 6, 6, 7, 8],
    durations: [280, 110, 110, 140, 140, 320],
  },
  {
    name: "running-right",
    row: 1,
    sourceFrames: [5, 4, 4, 5, 4, 4, 5, 4],
    mirror: true,
    durations: [120, 120, 120, 120, 120, 120, 120, 220],
  },
  {
    name: "running-left",
    row: 2,
    sourceFrames: [5, 4, 4, 5, 4, 4, 5, 4],
    durations: [120, 120, 120, 120, 120, 120, 120, 220],
  },
  {
    name: "waving",
    row: 3,
    sourceFrames: [6, 50, 51, 50],
    durations: [140, 140, 140, 280],
  },
  {
    name: "jumping",
    row: 4,
    sourceFrames: [119, 10, 10, 10, 119],
    offsets: [
      [0, 10],
      [0, -6],
      [0, -26],
      [0, -6],
      [0, 4],
    ],
    durations: [140, 140, 140, 140, 280],
  },
  {
    name: "failed",
    row: 5,
    sourceFrames: [70, 69, 68, 67, 66, 65, 64, 63],
    durations: [140, 140, 140, 140, 140, 140, 140, 240],
  },
  {
    name: "waiting",
    row: 6,
    sourceFrames: [78, 78, 79, 80, 79, 78],
    durations: [150, 150, 150, 150, 150, 260],
  },
  {
    name: "running",
    row: 7,
    sourceFrames: [2, 3, 2, 5, 4, 5],
    durations: [120, 120, 120, 120, 120, 220],
  },
  {
    name: "review",
    row: 8,
    sourceFrames: [6, 58, 59, 60, 61, 6],
    durations: [150, 150, 150, 150, 150, 280],
  },
] satisfies readonly AnimationSpec[];

export function createEditableAnimations(): EditableAnimation[] {
  return animationSpecs.map((spec) => ({
    name: spec.name,
    row: spec.row,
    durations: spec.durations,
    defaultFrames: [...spec.sourceFrames],
    defaultOffsets: createOffsets(spec.sourceFrames.length, spec.offsets),
    sourceFrames: [...spec.sourceFrames],
    mirror: Boolean(spec.mirror),
    offsets: createOffsets(spec.sourceFrames.length, spec.offsets),
  }));
}

function createOffsets(
  frameCount: number,
  offsets: readonly Offset[] | undefined,
): Offset[] {
  return Array.from({ length: frameCount }, (_, index) => offsets?.[index] ?? [0, 0]);
}
