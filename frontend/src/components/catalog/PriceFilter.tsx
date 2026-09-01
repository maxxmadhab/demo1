import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { PriceRange } from "@/components/catalog/PriceRange";

interface PriceFilterProps {
  min: number;
  max: number;
  value: [number, number] | null;
  onChange: (value: [number, number] | null) => void;
}

export function PriceFilter({ min, max, value, onChange }: PriceFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const active = Boolean(value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
          active
            ? "border-gold-deep text-gold-deep"
            : "border-charcoal/15 text-charcoal/75 hover:border-charcoal/40 hover:text-charcoal"
        }`}
      >
        Price
        {active && (
          <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold-deep px-1 text-[0.6rem] font-semibold text-ivory">
            1
          </span>
        )}
        <Icon
          name="chevron-down"
          size={12}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            className="absolute left-0 top-full z-40 mt-2 border border-charcoal/[0.08] bg-ivory p-2 shadow-lift"
          >
            <PriceRange min={min} max={max} value={value} onChange={onChange} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}