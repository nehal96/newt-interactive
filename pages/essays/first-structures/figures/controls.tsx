import { type ReactNode } from "react";
import { Slider } from "@ui/controls";

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
      <div className="flex items-baseline justify-between gap-4 font-mono text-xs text-ink-400">
        <span>{label}</span>
        <span className="text-ink-700">{display}</span>
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
    <p className="mt-5 font-mono text-xs leading-5 text-ink-500">{children}</p>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mt-5 font-ui text-sm leading-6 text-ink-500">
      {children}
    </figcaption>
  );
}
