import { Download } from "lucide-react";
import { CodexCellCanvas } from "./FrameCanvas";
import type { EditableAnimation, ExportFormat, ImageLoadState } from "../pet/types";

type StagePanelProps = {
  readonly imageState: ImageLoadState;
  readonly sourceImage: HTMLImageElement | null;
  readonly selected: EditableAnimation;
  readonly frame: number;
  readonly exportStatus: string;
  readonly onExport: (format: ExportFormat) => void;
};

export function StagePanel({
  imageState,
  sourceImage,
  selected,
  frame,
  exportStatus,
  onExport,
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
        <button className="button-with-icon" type="button" onClick={() => onExport("png")}>
          <Download aria-hidden="true" size={16} strokeWidth={2} />
          <span>Export PNG</span>
        </button>
        <button
          className="button-with-icon"
          type="button"
          onClick={() => onExport("webp")}
        >
          <Download aria-hidden="true" size={16} strokeWidth={2} />
          <span>Export WebP</span>
        </button>
      </div>
      {exportStatus ? (
        <div className="export-status" role="status">
          {exportStatus}
        </div>
      ) : null}
    </div>
  );
}
