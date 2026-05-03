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
