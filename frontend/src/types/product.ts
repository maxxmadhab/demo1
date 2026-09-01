export type Category =
  | "Rings"
  | "Earrings"
  | "Necklaces"
  | "Bracelets"
  | "Pendants"
  | "Bridal Jewelry";

export type Material =
  | "18K Gold"
  | "14K Gold"
  | "Platinum"
  | "Rose Gold"
  | "White Gold"
  | "Yellow Gold";

export type Gemstone =
  | "Diamond"
  | "Sapphire"
  | "Emerald"
  | "Ruby"
  | "Pearl"
  | "Opal"
  | "Amethyst"
  | "Topaz"
  | "Aquamarine"
  | "Garnet"
  | "No Gemstone";

export type Occasion =
  | "Everyday"
  | "Bridal"
  | "Statement"
  | "Gifting"
  | "Occasion";

export type Badge = "New" | "Best Seller" | "Limited" | "Iconic" | "Bridal";

export interface ProductVariant {
  id: string;
  name: string;
  material?: Material;
  price?: number;
  available: boolean;
}

export interface ProductDimensions {
  width?: string;
  length?: string;
  height?: string;
  weight?: string;
  stoneWeight?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  collection: string;
  price: number;
  material: Material;
  gemstone: Gemstone;
  description: string;
  shortDescription: string;
  images: string[];
  badge?: Badge;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  dimensions: ProductDimensions;
  variants: ProductVariant[];
  occasion: Occasion;
}
