import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatPriceCompact, clamp } from "@/utils/format";
import { cn } from "@/utils/cn";

interface PriceRangeProps {
  min: number;
  max: number;
  value: [number, number] | null;
  onChange: (value: [number, number] | null) => void;
}

export function PriceRange({ min, max, value, onChange }: PriceRangeProps) {
  const range = value ?? [min, max];
  const ref = useRef<HTMLDivElement>(null);

  const percent = (v: number) => ((v - min) / (max - min)) * 100;

  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {}, [range]);

  const onMinInput = (v: number) => {
    const clamped = clamp(v, min, range[1]);
    onChange([clamped, range[1]]);
  };
  const onMaxInput = (v: number) => {
    const clamped = clamp(v, range[0], max);
    onChange([range[0], clamped]);
  };

  const fillLeft = percent(range[0]);
  const fillRight = percent(range[1]);

  return (
    <div ref={ref} className="w-64 p-2">
      <div className="relative h-10">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-charcoal/15" />
        <div
          ref={trackRef}
          className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gold-deep"
          style={{ left: `${fillLeft}%`, right: `${100 - fillRight}%` }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={1000}
          value={range[0]}
          onChange={(e) => onMinInput(Number(e.target.value))}
          aria-label="Minimum price"
          className="pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-charcoal/20 [&::-webkit-slider-thumb]:bg-ivory [&::-webkit-slider-thumb]:shadow-card [&::-webkit-slider-thumb]:hover:border-gold-deep"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={1000}
          value={range[1]}
          onChange={(e) => onMaxInput(Number(e.target.value))}
          aria-label="Maximum price"
          className="pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-charcoal/20 [&::-webkit-slider-thumb]:bg-ivory [&::-webkit-slider-thumb]:shadow-card [&::-webkit-slider-thumb]:hover:border-gold-deep"
        />
      </div>

      <div className="mt-3 flex items-center justify-between font-body text-xs font-light text-charcoal/75">
        <span>{formatPriceCompact(range[0])}</span>
        <span>{formatPriceCompact(range[1])}</span>
      </div>

      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "mt-2 inline-flex items-center gap-1.5 font-body text-[0.62rem] font-medium uppercase tracking-[0.14em] text-stone underline-offset-4 transition-colors hover:text-charcoal",
          !value && "invisible"
        )}
      >
        <Icon name="close" size={10} /> Reset price
      </button>
    </div>
  );
}