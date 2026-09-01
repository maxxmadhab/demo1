export interface Collection {
  slug: string;
  name: string;
  spell: string;
  tagline: string;
  description: string;
  hero: string;
  editorial: string;
  accent: string;
}

export const collections: Collection[] = [
  {
    slug: "celeste",
    name: "Celeste",
    spell: "sə·lest",
    tagline: "Celestial elegance in brilliant-cut diamonds",
    description:
      "Inspired by the calm of a moonlit sky, Celeste captures the quiet brilliance of celestial light. Each piece is set in responsibly sourced metal and finished by hand for a luminous, enduring glow.",
    hero: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
    accent: "Diamond",
  },
  {
    slug: "elan",
    name: "Élan",
    spell: "ay·lon",
    tagline: "Modern lines with effortless Parisian grace",
    description:
      "The Élan collection is a study in restraint — fluid silhouettes, precise settings and a confident, modern simplicity designed to move with you.",
    hero: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop",
    accent: "Gold",
  },
  {
    slug: "luna",
    name: "Luna",
    spell: "loo·nuh",
    tagline: "Soft pearlescent light, round and serene",
    description:
      "Luna echoes the phases of the moon in rounded silhouettes and soft, luminous pearls and stones. A collection of quiet, dreamlike beauty.",
    hero: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1599623560574-39d485900c65?q=80&w=1600&auto=format&fit=crop",
    accent: "Pearl",
  },
  {
    slug: "aster",
    name: "Aster",
    spell: "as·tuhr",
    tagline: "Sculptural silhouette, architectural form",
    description:
      "Named for the star-shaped bloom, Aster shapes bold, sculptural jewellery with clean geometry and commanding presence.",
    hero: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1600&auto=format&fit=crop",
    accent: "Statement",
  },
  {
    slug: "solenne",
    name: "Solenne",
    spell: "so·len",
    tagline: "Warm, sunlit radiance of golden hour",
    description:
      "Solenne celebrates warmth — gilded textures, warm gold and a sun-kissed palette that captures the glow of golden hour.",
    hero: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop",
    accent: "Gold",
  },
  {
    slug: "aria",
    name: "Aria",
    spell: "ah·ree·uh",
    tagline: "A lyrical symphony of light and stone",
    description:
      "Aria is a flowing composition of movement and melody, where gemstones catch light like musical notes drifting through air.",
    hero: "https://images.unsplash.com/photo-1611107683227-e5b8f5aa7688?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1600&auto=format&fit=crop",
    accent: "Stone",
  },
  {
    slug: "muse",
    name: "Muse",
    spell: "myooz",
    tagline: "An homage to the eternal muse",
    description:
      "Muse draws inspiration from classical art and the women who inspire it — romantic, timeless and deeply personal.",
    hero: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1600&auto=format&fit=crop",
    accent: "Romantic",
  },
  {
    slug: "vela",
    name: "Vela",
    spell: "vay·luh",
    tagline: "The voyage of an everyday icon",
    description:
      "Vela is designed for the journey of everyday life — durable, versatile pieces that pair effortlessly with everything you wear.",
    hero: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop",
    editorial: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600&auto=format&fit=crop",
    accent: "Everyday",
  },
];
