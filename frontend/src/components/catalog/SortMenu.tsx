import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";
import type { SortKey } from "@/services/productService";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price · Low to High" },
  { value: "price-desc", label: "Price · High to Low" },
];

interface SortMenuProps {
  value: SortKey;
  onChange: (sort: SortKey) => void;
  className?: string;
}

export function SortMenu({ value, onChange, className }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-charcoal/15 px-4 font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] text-charcoal/75 transition-colors duration-300 hover:border-charcoal/40 hover:text-charcoal"
      >
        <span className="hidden sm:inline">Sort</span>
        <span className="hidden text-stone sm:inline">·</span>
        <span className="text-charcoal">{current.label}</span>
        <Icon
          name="chevron-down"
          size={12}
          className={cnRotate(open)}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={reducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-40 mt-2 w-56 border border-charcoal/[0.08] bg-ivory p-1 shadow-lift"
          >
            {SORT_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left font-body text-xs font-light text-charcoal/85 transition-colors duration-200 hover:bg-sand/60"
                >
                  {option.label}
                  {option.value === value && <Icon name="check" size={13} className="text-gold-deep" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function cnRotate(open: boolean) {
  return `transition-transform duration-300 ${open ? "rotate-180" : ""}`;
}