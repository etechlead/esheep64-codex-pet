import { CodexCellCanvas } from "./FrameCanvas";
import { OffsetControl } from "./OffsetControl";
import type { EditableAnimation, Offset } from "../pet/types";

type TargetSlotsEditorProps = {
  readonly selected: EditableAnimation;
  readonly sourceImage: HTMLImageElement | null;
  readonly frame: number;
  readonly selectedSlot: number;
  readonly selectedOffset: Offset;
  readonly onSelectSlot: (slot: number) => void;
  readonly onReset: () => void;
  readonly onOffsetChange: (axis: "x" | "y", value: number) => void;
};

export function TargetSlotsEditor({
  selected,
  sourceImage,
  frame,
  selectedSlot,
  selectedOffset,
  onSelectSlot,
  onReset,
  onOffsetChange,
}: TargetSlotsEditorProps) {
  return (
    <section className="editor" aria-label="Target atlas slots">
      <div className="editor-head">
        <div className="editor-title">Target slots</div>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </div>
      <div className="target-slots">
        {selected.sourceFrames.map((sourceFrame, slot) => (
          <button
            key={`${selected.name}-${slot}`}
            type="button"
            className={slot === frame ? "slot is-current-frame" : "slot"}
            aria-pressed={slot === selectedSlot}
            aria-label={`Target slot ${slot + 1}, original frame ${sourceFrame}`}
            onClick={() => onSelectSlot(slot)}
          >
            {sourceImage ? (
              <CodexCellCanvas sourceImage={sourceImage} state={selected} frame={slot} />
            ) : null}
          </button>
        ))}
      </div>
      <div className="placement-editor" aria-label="Selected slot placement">
        <div className="placement-title">Slot {selectedSlot + 1} placement</div>
        <OffsetControl
          label="X"
          min={-32}
          max={32}
          value={selectedOffset[0]}
          onChange={(value) => onOffsetChange("x", value)}
        />
        <OffsetControl
          label="Y"
          min={-48}
          max={48}
          value={selectedOffset[1]}
          onChange={(value) => onOffsetChange("y", value)}
        />
      </div>
    </section>
  );
}
