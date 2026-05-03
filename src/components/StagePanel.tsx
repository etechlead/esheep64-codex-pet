import { Download } from "lucide-react";
import { CodexCellCanvas } from "./FrameCanvas";
import petJsonUrl from "../../bundle/pet.json?url";
import { saveUrl, type SaveFileOptions } from "../pet/saveFile";
import type { EditableAnimation, ImageLoadState } from "../pet/types";

type StagePanelProps = {
  readonly imageState: ImageLoadState;
  readonly sourceImage: HTMLImageElement | null;
  readonly selected: EditableAnimation;
  readonly frame: number;
  readonly onSaveSpritesheet: () => Promise<void>;
};

export function StagePanel({
  imageState,
  sourceImage,
  selected,
  frame,
  onSaveSpritesheet,
}: StagePanelProps) {
  async function saveBundleFile(url: string, options: SaveFileOptions) {
    try {
      await saveUrl(url, options);
    } catch (error) {
      console.error(error);
    }
  }

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
        <button
          className="button-link button-with-icon"
          type="button"
          onClick={() =>
            void saveBundleFile(petJsonUrl, {
              suggestedName: "pet.json",
              mimeType: "application/json",
              extensions: [".json"],
              description: "JSON file",
            })
          }
        >
          <Download aria-hidden="true" size={16} strokeWidth={2} />
          <span>pet.json</span>
        </button>
        <button
          className="button-link button-with-icon"
          type="button"
          disabled={!sourceImage}
          onClick={() => void onSaveSpritesheet()}
        >
          <Download aria-hidden="true" size={16} strokeWidth={2} />
          <span>spritesheet.webp</span>
        </button>
      </div>
      <div className="install-hint">
        (put them into <code>~/.codex/pets/esheep64</code>)
      </div>
    </div>
  );
}
