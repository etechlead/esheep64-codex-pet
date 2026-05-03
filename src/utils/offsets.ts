import type { Offset } from "../pet/types";

export function createCompleteOffsets(
  offsets: readonly Offset[],
  frameCount: number,
): Offset[] {
  return Array.from({ length: frameCount }, (_, index) => offsets[index] ?? [0, 0]);
}
