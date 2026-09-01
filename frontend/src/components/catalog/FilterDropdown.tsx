import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

export interface MultiValue {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: MultiValue[];
  selected: string[];
  onChange: (values: string[]) => void;
  count?: number;
  searchable?: boolean;
  align?: "left" | "right";
}

export function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  count,
  searchable,
  align = "left",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const visible = searchable && query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const hasSelection = selected.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border px-4 font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
          hasSelection
            ? "border-gold-deep text-gold-deep"
            : "border-charcoal/15 text-charcoal/75 hover:border-charcoal/40 hover:text-charcoal"
        )}
      >
        {label}
        {count !== undefined && count > 0 && (
          <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold-deep px-1 text-[0.6rem] font-semibold text-ivory">
            {count}
          </span>
        )}
        <Icon
          name="chevron-down"
          size={12}
          className={cn("transition-transform duration-300", open && "rotate-180")}
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
            className={cn(
              "absolute top-full z-40 mt-2 w-64 border border-charcoal/[0.08] bg-ivory p-2 shadow-lift",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {searchable && (
              <div className="mb-1 border-b border-charcoal/10 px-2 pb-2">
                <label className="sr-only" htmlFor={`filter-search-${label}`}>
                  Search {label}
                </label>
                <input
                  id={`filter-search-${label}`}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-transparent py-1.5 font-body text-xs font-light text-charcoal placeholder:text-stone/50 focus:outline-none"
                />
              </div>
            )}
            <ul className="max-h-64 overflow-y-auto py-1">
              {visible.length === 0 && (
                <li className="px-3 py-2 font-body text-xs font-light text-stone">No options</li>
              )}
              {visible.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="menuitemcheckbox"
                      aria-checked={checked}
                      onClick={() => toggle(option.value)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left font-body text-xs font-light text-charcoal/85 transition-colors duration-200 hover:bg-sand/60"
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-200",
                          checked ? "border-gold-deep bg-gold-deep text-ivory" : "border-charcoal/25 bg-transparent"
                        )}
                      >
                        {checked && <Icon name="check" size={10} />}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-1 flex items-center justify-between border-t border-charcoal/10 px-2 pt-2">
              {hasSelection ? (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="font-body text-[0.62rem] font-medium uppercase tracking-[0.16em] text-stone underline underline-offset-4 hover:text-charcoal"
                >
                  Clear
                </button>
              ) : (
                <span />
              )}
              <span className="font-body text-[0.6rem] text-stone">{selected.length} selected</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}