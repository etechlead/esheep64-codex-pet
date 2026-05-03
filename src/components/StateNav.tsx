import type { EditableAnimation } from "../pet/types";

type StateNavProps = {
  readonly animations: readonly EditableAnimation[];
  readonly selectedName: string;
  readonly onSelect: (name: string) => void;
};

export function StateNav({ animations, selectedName, onSelect }: StateNavProps) {
  return (
    <nav className="state-nav" aria-label="Animation states">
      {animations.map((animation) => (
        <button
          key={animation.name}
          type="button"
          aria-pressed={animation.name === selectedName}
          onClick={() => onSelect(animation.name)}
        >
          {animation.name}
        </button>
      ))}
    </nav>
  );
}
