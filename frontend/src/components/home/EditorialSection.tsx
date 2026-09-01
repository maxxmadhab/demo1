import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { img } from "@/utils/images";

interface EditorialSectionProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: { label: string; to: string };
  image?: string;
  variant?: "split" | "full";
}

export function EditorialSection({
  eyebrow = "The atelier edit",
  title = "Crafted for moments that matter",
  body = "Each Jwel creation is cut, set and finished entirely by hand — a single luminous stroke from raw stone to final glow.",
  cta = { label: "Explore the collection", to: "/catalog" },
  image = img("ringCushion", { w: 1600, h: 2000 }),
  variant = "full",
}: EditorialSectionProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  if (variant === "split") {
    return (
      <section ref={ref} className="container-jwel grid grid-cols-1 items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: -32 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-[0.66rem] font-medium uppercase tracking-[0.3em] text-gold-deep">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.08] text-charcoal sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h2>
          <p className="mt-6 max-w-md font-body text-[0.95rem] font-light leading-relaxed text-stone">
            {body}
          </p>
          <div className="mt-8">
            <Button to={cta.to} variant="outline" size="md">
              {cta.label}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden bg-sand"
        >
          <motion.div style={reducedMotion ? undefined : { y: yImg }} className="absolute -inset-y-8 w-full">
            <ImageWithFallback src={image} alt={title} className="h-full w-full object-cover" />
          </motion.div>
          <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-charcoal/10" />
        </motion.div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative flex min-h-[80vh] items-center overflow-hidden">
      <motion.div style={reducedMotion ? undefined : { y: yImg }} className="absolute -inset-y-10 w-full">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/35 to-charcoal/10" />

      <div className="container-jwel relative py-28">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="font-body text-[0.66rem] font-medium uppercase tracking-[0.32em] text-champagne">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] text-ivory sm:text-6xl lg:text-[4rem]">
            {title}
          </h2>
          <p className="mt-6 max-w-lg font-body text-[0.95rem] font-light leading-relaxed text-ivory/80">
            {body}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to={cta.to} variant="light" size="lg">
              {cta.label}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}