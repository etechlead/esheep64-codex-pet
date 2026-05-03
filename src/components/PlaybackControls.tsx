type PlaybackControlsProps = {
  readonly playing: boolean;
  readonly speed: number;
  readonly frameHold: number;
  readonly onSpeedChange: (value: number) => void;
  readonly onFrameHoldChange: (value: number) => void;
  readonly onTogglePlaying: () => void;
  readonly onStep: () => void;
};

export function PlaybackControls({
  playing,
  speed,
  frameHold,
  onSpeedChange,
  onFrameHoldChange,
  onTogglePlaying,
  onStep,
}: PlaybackControlsProps) {
  return (
    <section className="controls" aria-label="Playback controls">
      <div className="playback-grid">
        <label className="control-row">
          <span>Speed</span>
          <input
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.currentTarget.value))}
          />
          <output>{speed.toFixed(2)}x</output>
        </label>
        <button type="button" onClick={onTogglePlaying}>
          {playing ? "Pause" : "Play"}
        </button>
        <label className="control-row">
          <span>Frame hold</span>
          <input
            type="range"
            min="1"
            max="4"
            step="0.25"
            value={frameHold}
            onChange={(event) => onFrameHoldChange(Number(event.currentTarget.value))}
          />
          <output>{frameHold.toFixed(2)}x</output>
        </label>
        <button type="button" onClick={onStep}>
          Step
        </button>
      </div>
    </section>
  );
}
