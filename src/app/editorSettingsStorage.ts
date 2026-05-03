import type { EditableAnimation, EditorSettings, Offset } from "../pet/types";

const editorSettingsKey = "esheep64-codex-pet:editor-settings:v1";

export function readEditorSettings(): EditorSettings | null {
  try {
    const rawSettings = window.localStorage.getItem(editorSettingsKey);
    if (!rawSettings) {
      return null;
    }
    return parseEditorSettings(JSON.parse(rawSettings));
  } catch {
    return null;
  }
}

export function writeEditorSettings(animations: readonly EditableAnimation[]): void {
  try {
    window.localStorage.setItem(
      editorSettingsKey,
      JSON.stringify(createEditorSettings(animations)),
    );
  } catch {
    // Persistence is best-effort; editing should still work without localStorage.
  }
}

export function applyEditorSettings(
  animations: readonly EditableAnimation[],
  settings: EditorSettings | null,
): EditableAnimation[] {
  if (!settings) {
    return animations.map(cloneAnimation);
  }

  return animations.map((animation) => {
    const saved = settings.animations[animation.name];
    if (!saved) {
      return cloneAnimation(animation);
    }

    return {
      ...animation,
      sourceFrames:
        saved.sourceFrames.length === animation.sourceFrames.length
          ? [...saved.sourceFrames]
          : [...animation.sourceFrames],
      offsets:
        saved.offsets.length === animation.offsets.length
          ? saved.offsets.map((offset) => [offset[0], offset[1]])
          : [...animation.offsets],
    };
  });
}

function createEditorSettings(
  animations: readonly EditableAnimation[],
): EditorSettings {
  return {
    version: 1,
    animations: Object.fromEntries(
      animations.map((animation) => [
        animation.name,
        {
          sourceFrames: [...animation.sourceFrames],
          offsets: animation.offsets.map((offset) => [offset[0], offset[1]]),
        },
      ]),
    ),
  };
}

function parseEditorSettings(value: unknown): EditorSettings | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.animations)) {
    return null;
  }

  const animations: EditorSettings["animations"] = {};
  for (const [name, animation] of Object.entries(value.animations)) {
    if (!isRecord(animation)) {
      continue;
    }

    const sourceFrames = parseSourceFrames(animation.sourceFrames);
    const offsets = parseOffsets(animation.offsets);
    if (sourceFrames.length > 0 && offsets.length > 0) {
      animations[name] = { sourceFrames, offsets };
    }
  }

  return { version: 1, animations };
}

function parseSourceFrames(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (frame): frame is number =>
      Number.isInteger(frame) && frame >= 0 && Number.isSafeInteger(frame),
  );
}

function parseOffsets(value: unknown): Offset[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const offsets: Offset[] = [];
  for (const offset of value) {
    if (!Array.isArray(offset) || offset.length !== 2) {
      continue;
    }

    const x: unknown = offset[0];
    const y: unknown = offset[1];
    if (typeof x === "number" && typeof y === "number" && Number.isFinite(x) && Number.isFinite(y)) {
      offsets.push([x, y]);
    }
  }
  return offsets;
}

function cloneAnimation(animation: EditableAnimation): EditableAnimation {
  return {
    ...animation,
    sourceFrames: [...animation.sourceFrames],
    offsets: [...animation.offsets],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
