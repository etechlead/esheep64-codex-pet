import { useEffect, useRef } from "react";
import { drawCodexCell, drawSourceFrame, getCanvasContext } from "../pet/atlas";
import {
  cellHeight,
  cellWidth,
  sourceFrameHeight,
  sourceFrameWidth,
} from "../pet/petData";
import type { EditableAnimation } from "../pet/types";

type CodexCellCanvasProps = {
  readonly sourceImage: HTMLImageElement;
  readonly state: EditableAnimation;
  readonly frame: number;
};

export function CodexCellCanvas({ sourceImage, state, frame }: CodexCellCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    drawCodexCell(getCanvasContext(canvasRef.current), sourceImage, state, frame);
  }, [sourceImage, state, frame]);

  return (
    <canvas
      ref={canvasRef}
      width={cellWidth}
      height={cellHeight}
      aria-label={`${state.name} frame ${frame + 1}`}
    />
  );
}

type SourceFrameCanvasProps = {
  readonly sourceImage: HTMLImageElement;
  readonly frameId: number;
};

export function SourceFrameCanvas({ sourceImage, frameId }: SourceFrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    drawSourceFrame(getCanvasContext(canvasRef.current), sourceImage, frameId);
  }, [sourceImage, frameId]);

  return (
    <canvas
      ref={canvasRef}
      width={sourceFrameWidth}
      height={sourceFrameHeight}
      aria-label={`Original frame ${frameId}`}
    />
  );
}
