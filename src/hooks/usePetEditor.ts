import { useEffect, useMemo, useState } from "react";
import {
  applyEditorSettings,
  readEditorSettings,
  writeEditorSettings,
} from "../app/editorSettingsStorage";
import { totalSourceFrames } from "../pet/atlas";
import { exportCodexAtlas } from "../pet/exportAtlas";
import { loadSourceFrames } from "../pet/imageLoading";
import { createEditableAnimations, sourceFramesPath } from "../pet/petData";
import type { EditableAnimation, ImageLoadState, Offset } from "../pet/types";
import { createCompleteOffsets } from "../utils/offsets";

const initialAnimations = createEditableAnimations();
const firstAnimationName = initialAnimations[0]?.name ?? "";

export function usePetEditor() {
  const [animations, setAnimations] = useState<EditableAnimation[]>(() =>
    applyEditorSettings(createEditableAnimations(), readEditorSettings()),
  );
  const [imageState, setImageState] = useState<ImageLoadState>({ status: "loading" });
  const [selectedName, setSelectedName] = useState(firstAnimationName);
  const [frame, setFrame] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [frameHold, setFrameHold] = useState(2);
  const [exportStatus, setExportStatus] = useState("");

  useEffect(() => {
    void loadSourceFrames(sourceFramesPath).then(setImageState);
  }, []);

  useEffect(() => {
    writeEditorSettings(animations);
  }, [animations]);

  const selected = useMemo(() => {
    const animation =
      animations.find((candidate) => candidate.name === selectedName) ?? animations[0];
    if (!animation) {
      throw new Error("No animation states are configured");
    }
    return animation;
  }, [animations, selectedName]);

  const sourceImage = imageState.status === "ready" ? imageState.sourceFrames : null;

  const sourceFrameIds = useMemo(() => {
    if (!sourceImage) {
      return [];
    }
    return Array.from({ length: totalSourceFrames(sourceImage) }, (_, index) => index);
  }, [sourceImage]);

  const usedSourceFrames = useMemo(
    () => new Set(selected.sourceFrames),
    [selected.sourceFrames],
  );
  const selectedOffset = selected.offsets[selectedSlot] ?? ([0, 0] satisfies Offset);

  useEffect(() => {
    if (!playing || selected.sourceFrames.length === 0) {
      return;
    }
    const currentFrame = Math.min(frame, selected.sourceFrames.length - 1);
    const holdMs = ((selected.durations[currentFrame] ?? 140) * frameHold) / speed;
    const timer = window.setTimeout(() => {
      setFrame((value) => (value + 1) % selected.sourceFrames.length);
    }, holdMs);
    return () => window.clearTimeout(timer);
  }, [
    playing,
    frame,
    selected.durations,
    selected.sourceFrames.length,
    frameHold,
    speed,
  ]);

  function selectAnimation(name: string) {
    setSelectedName(name);
    setFrame(0);
    setSelectedSlot(0);
  }

  function selectSlot(slot: number) {
    setSelectedSlot(slot);
    setFrame(slot);
  }

  function assignSourceFrame(frameId: number) {
    const slot = selectedSlot;
    setAnimations((current) =>
      current.map((animation) => {
        if (animation.name !== selected.name) {
          return animation;
        }
        return {
          ...animation,
          sourceFrames: animation.sourceFrames.map((value, index) =>
            index === slot ? frameId : value,
          ),
        };
      }),
    );
    setFrame(slot);
  }

  function resetSelectedAnimation() {
    setAnimations((current) =>
      current.map((animation) => {
        if (animation.name !== selected.name) {
          return animation;
        }
        return {
          ...animation,
          sourceFrames: [...animation.defaultFrames],
          offsets: [...animation.defaultOffsets],
        };
      }),
    );
    setFrame(0);
    setSelectedSlot(0);
  }

  function stepFrame() {
    if (selected.sourceFrames.length === 0) {
      return;
    }
    setPlaying(false);
    setFrame((value) => (value + 1) % selected.sourceFrames.length);
  }

  function updateSelectedSlotOffset(axis: "x" | "y", value: number) {
    const slot = selectedSlot;
    setAnimations((current) =>
      current.map((animation) => {
        if (animation.name !== selected.name) {
          return animation;
        }

        const offsets = createCompleteOffsets(
          animation.offsets,
          animation.sourceFrames.length,
        );
        const currentOffset = offsets[slot] ?? [0, 0];
        offsets[slot] =
          axis === "x" ? [value, currentOffset[1]] : [currentOffset[0], value];

        return {
          ...animation,
          offsets,
        };
      }),
    );
  }

  async function exportAtlas() {
    if (!sourceImage) {
      setExportStatus("Source frames are not loaded yet");
      return;
    }

    try {
      setExportStatus("Generating WEBP...");
      setExportStatus(await exportCodexAtlas(animations, sourceImage));
    } catch (error) {
      setExportStatus(
        error instanceof Error ? error.message : "WEBP export failed",
      );
    }
  }

  return {
    animations,
    imageState,
    sourceImage,
    sourceFrameIds,
    usedSourceFrames,
    selected,
    selectedSlot,
    selectedOffset,
    frame,
    playing,
    speed,
    frameHold,
    exportStatus,
    setPlaying,
    setSpeed,
    setFrameHold,
    selectAnimation,
    selectSlot,
    assignSourceFrame,
    resetSelectedAnimation,
    stepFrame,
    updateSelectedSlotOffset,
    exportAtlas,
  };
}
