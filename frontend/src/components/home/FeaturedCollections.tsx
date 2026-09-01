import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { img } from "@/utils/images";

const FEATURED = [
  { slug: "celeste", blurb: "Celestial brilliance in diamonds" },
  { slug: "elan", blurb: "Effortless French minimalism" },
  { slug: "luna", blurb: "Soft, pearlescent light" },
  { slug: "aster", blurb: "Sculptural geometry" },
  { slug: "solenne", blurb: "The warmth of golden hour" },
];

const HERO_KEYS: Record<string, string> = {
  celeste: "ringSolitaire",
  elan: "necklaceModel",
  luna: "pearlModel",
  aster: "ringCushion",
  solenne: "braceletGold",
};

export function FeaturedCollections() {
  return (
    <section className="container-jwel py-20 lg:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 lg:mb-14">
        <SectionHeading
          align="left"
          eyebrow="The collections"
          title="Stories told in stone"
          className="!max-w-none"
        />
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 font-body text-[0.66rem] font-medium uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 hover:text-gold-deep"
        >
          View all pieces <Icon name="arrow-right" size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {/* First: large editorial card */}
        <CollectionCard collection={FEATURED[0]} className="sm:col-span-2 lg:col-span-7 lg:aspect-auto lg:min-h-[32rem]" large />

        {/* Second */}
        <CollectionCard collection={FEATURED[1]} className="lg:col-span-5 lg:min-h-[32rem]" />

        {/* Remaining three */}
        {FEATURED.slice(2).map((c) => (
          <CollectionCard key={c.slug} collection={c} className="lg:col-span-4" />
        ))}
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  className,
  large,
}: {
  collection: (typeof FEATURED)[number];
  className?: string;
  large?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Link
        to={`/collection/${collection.slug}`}
        className="group relative block h-full overflow-hidden bg-sand"
      >
        <span className="block aspect-[4/5] w-full lg:aspect-auto lg:absolute lg:inset-0">
          <ImageWithFallback
            src={img(HERO_KEYS[collection.slug], { w: large ? 1400 : 900, crop: "center" })}
            alt={`The ${collection.slug} collection`}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </span>
        <span className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/15 to-transparent" />

        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6 lg:p-8">
          <span>
            <span className="block font-display text-2xl font-medium text-ivory sm:text-3xl lg:text-4xl">
              {collection.slug === "elan" ? "Élan" : collection.slug.charAt(0).toUpperCase() + collection.slug.slice(1)}
            </span>
            <span className="mt-1.5 block font-body text-[0.72rem] font-light tracking-wide text-ivory/75">
              {collection.blurb}
            </span>
          </span>
          <span className="flex h-10 w-10 shrink-0 translate-y-1 items-center justify-center rounded-full border border-ivory/40 text-ivory opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <Icon name="arrow-right" size={16} />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}