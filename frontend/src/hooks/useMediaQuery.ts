import { useEffect, useState } from "react";

const QUERIES: Record<string, string> = {
  xs: "(max-width: 479px)",
  sm: "(min-width: 480px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery(QUERIES.xs);
}

export function useIsTablet(): boolean {
  return useMediaQuery(QUERIES.md) && !useMediaQuery(QUERIES.lg);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(QUERIES.lg);
}