export interface ImageVariant {
  src: string;
  alt: string;
}

const UNSPLASH_BASE = "https://images.unsplash.com/";

/**
 * Central image library keyed by numeric Unsplash photo id.
 * Replace these later with Supabase Storage paths without touching components.
 */
export const IMAGE_LIBRARY: Record<string, string> = {
  ringDiamond: "photo-1515562141207-7a88fb7ce338",
  flatlayGold: "photo-1605100804763-247f67b3557e",
  necklaceModel: "photo-1617038220319-276d3cfab638",
  flatlayJewel: "photo-1611591437281-460bfbe1220a",
  ringsGold: "photo-1535632066927-ab7c9ab60908",
  necklaceDiamond: "photo-1599643478518-a784e5dc4c8f",
  pearlModel: "photo-1522312346375-d1a52e2b99b3",
  braceletGold: "photo-1599643477877-530eb83abc8e",
  ringSolitaire: "photo-1611652022419-a9419f74343d",
  editorialWoman: "photo-1573408301185-9146fe634ad0",
  ringStack: "photo-1611590027211-b954fd027b51",
  engagementRing: "photo-1611085583191-a3b181a88401",
  goldWatch: "photo-1601121141461-9d6647bca1ed",
  chainNecklace: "photo-1617038260897-41a1f14a8ca0",
  earringsDiamond: "photo-1602173574767-37ac01994b2a",
  emeraldRing: "photo-1517639493569-5666a7b2f494",
  ringCloseup: "photo-1630019852942-f89202989a59",
  ringCushion: "photo-1603561591411-07134e71a2a9",
  goldRingPair: "photo-1584917865442-de89df76afd3",
  pendantGold: "photo-1600003014755-ba31aa59c4b6",
};

export const FALLBACK_IMAGE = `${UNSPLASH_BASE}${IMAGE_LIBRARY.flatlayJewel}?q=80&w=900&h=1125&auto=format&fit=crop`;

interface ImgOptions {
  w?: number;
  h?: number;
  crop?: "center" | "top" | "bottom" | "left" | "right" | "entropy" | "faces";
}

/** Build a sized/cropped Unsplash URL from a library key. */
export function img(key: string, opts: ImgOptions = {}): string {
  const id = IMAGE_LIBRARY[key] ?? key;
  const { w = 900, h = 1125, crop = "center" } = opts;
  const params = new URLSearchParams({
    q: "80",
    w: String(w),
    h: String(h),
    auto: "format",
    fit: "crop",
    crop,
  });
  return `${UNSPLASH_BASE}${id}?${params.toString()}`;
}

/**
 * Build a set of image variants for a product from an ordered list of
 * library keys. Different crops simulate multiple photographic angles.
 */
export function buildProductImages(
  keys: string[],
  name: string,
  base: ImgOptions["crop"] = "center"
): string[] {
  const crops: ImgOptions["crop"][] = [base, "top", "bottom", "faces", "left"];
  return keys.map((key, i) => img(key, { crop: crops[i % crops.length] }));
}

export function imageAlt(productName: string, index: number): string {
  return `${productName} — fine jewellery view ${index + 1}`;
}