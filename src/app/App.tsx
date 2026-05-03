import { PlaybackControls } from "../components/PlaybackControls";
import { SourceAtlasPicker } from "../components/SourceAtlasPicker";
import { StagePanel } from "../components/StagePanel";
import { StateNav } from "../components/StateNav";
import { TargetSlotsEditor } from "../components/TargetSlotsEditor";
import { usePetEditor } from "../hooks/usePetEditor";

export default function App() {
  const editor = usePetEditor();

  return (
    <main className="app-shell">
      <a
        className="github-chevron"
        href="https://github.com/etechlead/esheep64-codex-pet"
        target="_blank"
        rel="noreferrer"
        aria-label="Open GitHub repository"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.49c-2.24.49-2.71-.95-2.71-.95-.36-.93-.9-1.18-.9-1.18-.73-.5.06-.49.06-.49.81.06 1.24.83 1.24.83.72 1.23 1.88.88 2.34.67.07-.52.28-.88.51-1.08-1.79-.2-3.67-.89-3.67-3.97 0-.88.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .68-.22 2.2.82A7.68 7.68 0 0 1 8 3.83c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.27.83 2.15 0 3.09-1.89 3.77-3.68 3.97.29.25.55.74.55 1.5v2.19c0 .21.14.45.55.38A8 8 0 0 0 8 0Z"
          />
        </svg>
      </a>
      <header className="app-header">
        <h1>eSheep64 Codex Pet Editor</h1>
      </header>

      <section className="workspace">
        <StateNav
          animations={editor.animations}
          selectedName={editor.selected.name}
          onSelect={editor.selectAnimation}
        />

        <section className="stage-wrap">
          <StagePanel
            imageState={editor.imageState}
            sourceImage={editor.sourceImage}
            selected={editor.selected}
            frame={editor.frame}
            onSaveSpritesheet={editor.exportAtlas}
          />

          <aside className="details">
            <PlaybackControls
              playing={editor.playing}
              speed={editor.speed}
              frameHold={editor.frameHold}
              onSpeedChange={editor.setSpeed}
              onFrameHoldChange={editor.setFrameHold}
              onTogglePlaying={() => editor.setPlaying((value) => !value)}
              onStep={editor.stepFrame}
            />

            <TargetSlotsEditor
              selected={editor.selected}
              sourceImage={editor.sourceImage}
              frame={editor.frame}
              selectedSlot={editor.selectedSlot}
              selectedOffset={editor.selectedOffset}
              onSelectSlot={editor.selectSlot}
              onReset={editor.resetSelectedAnimation}
              onOffsetChange={editor.updateSelectedSlotOffset}
            />
          </aside>
        </section>

        <SourceAtlasPicker
          selected={editor.selected}
          selectedSlot={editor.selectedSlot}
          sourceImage={editor.sourceImage}
          sourceFrameIds={editor.sourceFrameIds}
          usedSourceFrames={editor.usedSourceFrames}
          onAssignSourceFrame={editor.assignSourceFrame}
        />
      </section>

      <footer className="app-footer">
        eSheep64 source images are from{" "}
        <a
          href="https://github.com/Adrianotiger/desktopPet"
          target="_blank"
          rel="noreferrer"
        >
          Adrianotiger/desktopPet
        </a>
        .
      </footer>
    </main>
  );
}
