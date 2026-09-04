import type { Badge, Category } from "@/types/product";

export const CATEGORIES: Category[] = [
  "New Arrivals",
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
];

export const BADGES: Badge[] = ["New", "Best Seller", "Limited", "Iconic", "Bridal"];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as string[]).includes(value);
}

export function isBadge(value: string): value is Badge {
  return (BADGES as string[]).includes(value);
}

/** Navigation links shown in the shared header/footer (categories + entry points). */
export const NAV_LINKS = [
  { label: "New Arrivals", to: "/catalog?sort=newest", category: "New Arrivals" },
  { label: "Rings", to: "/catalog?category=Rings", category: "Rings" },
  { label: "Necklaces", to: "/catalog?category=Necklaces", category: "Necklaces" },
  { label: "Earrings", to: "/catalog?category=Earrings", category: "Earrings" },
  { label: "Bracelets", to: "/catalog?category=Bracelets", category: "Bracelets" },
] as const;
