import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import type { Product } from "@/types/product";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/utils/format";

const STORY_SLUGS = [
  "celeste-halo-diamond-ring",
  "celeste-drop-earrings",
  "celeste-collar-necklace",
  "celeste-tennis-bracelet",
  "celeste-bridal-necklace",
];

const CHAPTER_TITLES = [
  "The Ring — where it begins",
  "The Earrings — light in motion",
  "The Necklace — at the collarbone",
  "The Bracelet — a river of light",
  "The Bridal Piece — the grand finale",
];

function getStoryProducts(): Product[] {
  return STORY_SLUGS
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}

export function JewelryStoryScroll() {
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (reducedMotion) {
    return <StoryStatic />;
  }
  if (!isDesktop) {
    return <StoryCarousel />;
  }
  return <StoryScrollInteractive />;
}

/* ============================================================ */
/* Desktop: vertical scroll drives a horizontal story gallery   */
/* ============================================================ */
function StoryScrollInteractive() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [shiftPx, setShiftPx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -shiftPx]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !stickyRef.current) return;
      setShiftPx(trackRef.current.scrollWidth - stickyRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const story = getStoryProducts();

  return (
    <section ref={sectionRef} className="relative" style={{ height: "420vh" }} aria-label="The Celeste story">
      <div ref={stickyRef} className="sticky top-0 flex h-screen flex-col overflow-hidden bg-charcoal text-ivory">
        {/* Intro overlay top-left */}
        <div className="pointer-events-none absolute left-12 top-20 z-10">
          <p className="font-body text-[0.66rem] font-medium uppercase tracking-[0.3em] text-champagne">
            The story in four acts
          </p>
          <p className="mt-2 font-display text-2xl font-medium leading-tight">
            From first light to the final bow
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute right-12 top-10 left-12 z-10 flex items-center gap-4">
          <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.26em] text-ivory/60">
            Keep scrolling
          </span>
          <div className="h-px flex-1 bg-ivory/20">
            <motion.div style={{ width: progressWidth }} className="h-px bg-champagne" />
          </div>
        </div>

        {/* Track */}
        <motion.div ref={trackRef} style={{ x }} className="flex h-full items-end">
          {story.map((product, i) => (
            <StoryChapter
              key={product.id}
              product={product}
              index={`0${i + 1}`}
              title={CHAPTER_TITLES[i]}
              isLast={i === story.length - 1}
            />
          ))}
          <StoryEndCard />
        </motion.div>

        {/* End state hint */}
        <div className="absolute bottom-10 left-12">
          <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.26em] text-ivory/60">
            Scroll returns to vertical
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* Desktop end card — clear way forward after the last chapter  */
/* ============================================================ */
function StoryEndCard() {
  return (
    <div className="flex h-full w-screen shrink-0 flex-col items-center justify-center px-12 text-center">
      <p className="font-display text-6xl font-light text-ivory/15">FIN</p>
      <h3 className="mt-6 font-display text-4xl font-medium text-ivory sm:text-5xl">
        The story, continued
      </h3>
      <p className="mt-4 max-w-md font-body text-[0.9rem] font-light leading-relaxed text-ivory/70">
        Five acts, one journey of light. Keep going — there is more to explore below
        and across the maison.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="light"
          onClick={() => {
            document.getElementById("jwel-explore-more")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Explore more <Icon name="arrow-right" size={14} />
        </Button>
        <Button to="/catalog" variant="outline" className="border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal">
          View all products
        </Button>
        <Button to="/collection/elan" variant="ghost" className="text-ivory hover:text-champagne">
          Next collection · Élan
        </Button>
      </div>
    </div>
  );
}

function StoryChapter({
  product,
  index,
  title,
  isLast,
}: {
  product: Product;
  index: string;
  title: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex h-full w-screen shrink-0 items-center gap-16 px-20 lg:px-24">
      {/* Text column */}
      <div className="w-[26rem] shrink-0">
        <p className="font-display text-6xl font-light text-ivory/15">{index}</p>
        <p className="mt-4 font-body text-[0.66rem] font-medium uppercase tracking-[0.28em] text-champagne">
          {title}
        </p>
        <h3 className="mt-3 font-display text-4xl font-medium leading-[1.08]">
          {product.name}
        </h3>
        <p className="mt-3 font-body text-[0.88rem] font-light leading-relaxed text-ivory/75">
          {product.shortDescription}
        </p>
        <p className="mt-5 font-body text-sm font-normal text-ivory">
          {formatPrice(product.price)}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="group mt-7 inline-flex items-center gap-2 border-b border-champagne/50 pb-2 font-body text-[0.66rem] font-medium uppercase tracking-[0.2em] text-champagne transition-colors duration-300 hover:border-champagne hover:text-ivory"
        >
          View the piece
          <Icon name="arrow-up-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Image column */}
      <div className={`relative h-[72vh] ${isLast ? "w-[70vw]" : "w-[46vw]"} overflow-hidden bg-charcoal-light/40`}>
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          sizes="46vw"
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-charcoal/60 px-3 py-1 font-body text-[0.6rem] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm">
          {product.material} · {product.gemstone}
        </span>
      </div>
    </div>
  );
}

/* ============================================================ */
/* Mobile / tablet: horizontal swipe carousel                   */
/* ============================================================ */
function StoryCarousel() {
  const story = getStoryProducts();
  return (
    <section className="overflow-hidden py-20" aria-label="The Celeste story">
      <div className="container-jwel mb-8">
        <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gold-deep">
          The story in four acts
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium text-charcoal">
          From first light to the final bow
        </h2>
        <p className="mt-2 font-body text-xs font-light text-stone">Swipe to explore</p>
      </div>
      <div className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto">
        {story.map((product, i) => (
          <div key={product.id} className="flex w-screen shrink-0 snap-start flex-col sm:flex-row">
            <div className="relative mx-5 h-[60vh] overflow-hidden bg-sand sm:mx-8 sm:h-[64vh] sm:w-[45vw]">
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-charcoal/60 px-3 py-1 font-body text-[0.6rem] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm">
                {product.material}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:pl-10">
              <p className="font-display text-5xl font-light text-charcoal/15">{`0${i + 1}`}</p>
              <p className="mt-3 font-body text-[0.62rem] font-medium uppercase tracking-[0.26em] text-gold-deep">
                {CHAPTER_TITLES[i]}
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium leading-snug text-charcoal sm:text-3xl">
                {product.name}
              </h3>
              <p className="mt-3 max-w-md font-body text-sm font-light leading-relaxed text-stone">
                {product.shortDescription}
              </p>
              <p className="mt-4 font-body text-sm font-medium text-charcoal">
                {formatPrice(product.price)}
              </p>
              <Link
                to={`/product/${product.slug}`}
                className="mt-5 inline-flex items-center gap-2 font-body text-[0.66rem] font-medium uppercase tracking-[0.2em] text-gold-deep"
              >
                View the piece <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        ))}

        {/* End slide — continue navigation */}
        <div className="flex w-screen shrink-0 snap-start items-center justify-center px-10 py-14 text-center">
          <div className="max-w-md">
            <p className="font-display text-5xl font-light text-charcoal/15">FIN</p>
            <h3 className="mt-4 font-display text-3xl font-medium text-charcoal sm:text-4xl">
              The story, continued
            </h3>
            <p className="mx-auto mt-3 font-body text-sm font-light leading-relaxed text-stone">
              Five acts, one journey of light. Continue through the catalogue or step into the
              next collection.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("jwel-explore-more")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore more <Icon name="arrow-right" size={14} />
              </Button>
              <Button to="/catalog" variant="ghost">
                View all products
              </Button>
              <Button to="/collection/elan" variant="primary">
                Next collection · Élan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* Reduced motion: simple static grid                          */
/* ============================================================ */
function StoryStatic() {
  const story = getStoryProducts();
  return (
    <section className="container-jwel py-20" aria-label="The Celeste story">
      <div className="mb-10">
        <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gold-deep">
          The story in four acts
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium text-charcoal sm:text-4xl">
          From first light to the final bow
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {story.map((product, i) => (
          <Link key={product.id} to={`/product/${product.slug}`} className="group">
            <div className="relative overflow-hidden bg-sand">
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute left-3 top-3 font-display text-4xl font-light text-ivory/80">
                {`0${i + 1}`}
              </span>
            </div>
            <p className="mt-3 font-display text-lg font-medium text-charcoal">{product.name}</p>
            <p className="mt-1 font-body text-xs font-light text-stone">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}