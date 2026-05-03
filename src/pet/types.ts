export type Offset = readonly [x: number, y: number];

export type AnimationSpec = {
  readonly name: string;
  readonly row: number;
  readonly sourceFrames: readonly number[];
  readonly durations: readonly number[];
  readonly mirror?: boolean;
  readonly offsets?: readonly Offset[];
};

export type EditableAnimation = {
  readonly name: string;
  readonly row: number;
  readonly durations: readonly number[];
  readonly defaultFrames: readonly number[];
  readonly defaultOffsets: readonly Offset[];
  readonly mirror: boolean;
  offsets: Offset[];
  sourceFrames: number[];
};

export type AnimationSettings = {
  readonly sourceFrames: readonly number[];
  readonly offsets: readonly Offset[];
};

export type EditorSettings = {
  readonly version: 1;
  readonly animations: Record<string, AnimationSettings>;
};

export type ImageLoadState =
  | { status: "loading" }
  | { status: "ready"; sourceFrames: HTMLImageElement }
  | { status: "failed"; message: string };
