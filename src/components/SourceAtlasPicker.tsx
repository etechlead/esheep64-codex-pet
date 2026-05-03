import { SourceFrameCanvas } from "./FrameCanvas";
import type { EditableAnimation } from "../pet/types";

type SourceAtlasPickerProps = {
  readonly selected: EditableAnimation;
  readonly selectedSlot: number;
  readonly sourceImage: HTMLImageElement | null;
  readonly sourceFrameIds: readonly number[];
  readonly usedSourceFrames: ReadonlySet<number>;
  readonly onAssignSourceFrame: (frameId: number) => void;
};

export function SourceAtlasPicker({
  selected,
  selectedSlot,
  sourceImage,
  sourceFrameIds,
  usedSourceFrames,
  onAssignSourceFrame,
}: SourceAtlasPickerProps) {
  return (
    <section className="source-picker" aria-label="Original source atlas">
      <div className="source-toolbar">
        <div className="source-title">Original atlas</div>
        <div className="source-hint">
          {selected.name}: slot {selectedSlot + 1} uses original frame{" "}
          {selected.sourceFrames[selectedSlot]}
        </div>
      </div>
      <div className="source-grid">
        {sourceImage
          ? sourceFrameIds.map((sourceFrameId) => (
              <button
                key={sourceFrameId}
                type="button"
                className={[
                  "source-frame",
                  usedSourceFrames.has(sourceFrameId) ? "is-used" : "",
                  selected.sourceFrames[selectedSlot] === sourceFrameId
                    ? "is-current-source"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`Original frame ${sourceFrameId}`}
                onClick={() => onAssignSourceFrame(sourceFrameId)}
              >
                <SourceFrameCanvas sourceImage={sourceImage} frameId={sourceFrameId} />
                <span>{sourceFrameId}</span>
              </button>
            ))
          : null}
      </div>
    </section>
  );
}
