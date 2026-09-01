import { useCallback, useEffect } from "react";

/** Locks page scroll while `active` is true (used by modals/drawers). */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

/** Close an overlay when the Escape key is pressed. */
export function useEscapeKey(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, onClose]);
}

/** Focus the first focusable element inside the referenced container on mount. */
export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    const focusables = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusables[0]?.focus();
  }, [containerRef]);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(focusFirst, 50);
    return () => window.clearTimeout(t);
  }, [active, focusFirst]);
}