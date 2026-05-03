type OffsetControlProps = {
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly value: number;
  readonly onChange: (value: number) => void;
};

export function OffsetControl({
  label,
  min,
  max,
  value,
  onChange,
}: OffsetControlProps) {
  function handleChange(rawValue: string) {
    const parsed = Number.parseInt(rawValue, 10);
    if (!Number.isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  }

  return (
    <label className="placement-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => handleChange(event.currentTarget.value)}
      />
      <input
        type="number"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => handleChange(event.currentTarget.value)}
      />
    </label>
  );
}
