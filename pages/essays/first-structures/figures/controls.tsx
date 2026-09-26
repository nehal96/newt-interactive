import { type ReactNode, useId } from "react";
import { Checkbox, Slider } from "@ui/controls";

export function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4 text-sm text-ink-500">
        <span>{label}</span>
        <span className="text-base font-semibold tabular-nums text-ink-800">
          {display}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      />
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 text-sm leading-6 text-ink-700">{children}</p>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mt-5 font-ui text-sm leading-6 text-ink-500">
      {children}
    </figcaption>
  );
}

export function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm text-ink-500"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      {label}
    </label>
  );
}

export function Readouts({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-500">
      {items.map(([label, value]) => (
        <span key={label}>
          {label}{" "}
          <span className="text-base font-semibold tabular-nums text-ink-800">
            {value}
          </span>
        </span>
      ))}
    </div>
  );
}
