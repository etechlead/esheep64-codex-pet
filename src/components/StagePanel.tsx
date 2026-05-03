import { Download } from "lucide-react";
import { CodexCellCanvas } from "./FrameCanvas";
import petJsonUrl from "../../bundle/pet.json?url";
import spritesheetUrl from "../../bundle/spritesheet.webp?url";
import type { EditableAnimation, ImageLoadState } from "../pet/types";

type StagePanelProps = {
  readonly imageState: ImageLoadState;
  readonly sourceImage: HTMLImageElement | null;
  readonly selected: EditableAnimation;
  readonly frame: number;
};

export function StagePanel({
  imageState,
  sourceImage,
  selected,
  frame,
}: StagePanelProps) {
  return (
    <div className="stage-panel">
      <div className="stage">
        {sourceImage ? (
          <CodexCellCanvas sourceImage={sourceImage} state={selected} frame={frame} />
        ) : imageState.status === "failed" ? (
          <div className="loading-box">{imageState.message}</div>
        ) : (
          <div className="loading-box">Loading</div>
        )}
      </div>
      <div className="stage-export-row">
        <a className="button-link button-with-icon" href={petJsonUrl} download="pet.json">
          <Download aria-hidden="true" size={16} strokeWidth={2} />
          <span>pet.json</span>
        </a>
        <a
          className="button-link button-with-icon"
          href={spritesheetUrl}
          download="spritesheet.webp"
        >
          <Download aria-hidden="true" size={16} strokeWidth={2} />
          <span>spritesheet.webp</span>
        </a>
      </div>
      <div className="install-hint">
        (put them into <code>~/.codex/pets/esheep64</code>)
      </div>
    </div>
  );
}
