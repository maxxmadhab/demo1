import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { img } from "@/utils/images";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[92vh] items-end overflow-hidden">
      {/* Parallax background */}
      <motion.div style={reducedMotion ? undefined : { y }} className="absolute inset-0">
        <ImageWithFallback
          src={img("necklaceModel", { w: 1920, h: 1280, crop: "faces" })}
          alt="A model wearing fine Budhram diamond jewellery"
          className="h-[115%] w-full object-cover"
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-charcoal/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 to-transparent" />

      {/* Content */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={reducedMotion ? undefined : { opacity }}
        className="container-jwel relative pb-16 pt-40 sm:pb-20 lg:pb-24"
      >
        <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-champagne">
          The Autumn — Winter Collection
        </p>
        <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.6rem] font-medium leading-[1.04] text-ivory sm:text-6xl lg:text-7xl">
          Crafted for moments that matter
        </h1>
        <p className="mt-6 max-w-xl font-body text-[0.95rem] font-light leading-relaxed text-ivory/85">
          Hand-finished fine jewellery in responsibly sourced metal and stone. Pieces
          as individual as the stories they will witness.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button to="/catalog" variant="light" size="lg">
            Explore the collection
          </Button>
          <Button to="/collection/celeste" variant="ghost" size="lg" className="text-ivory hover:text-champagne">
            The Celeste story
          </Button>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-hidden="true"
      >
        <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.3em] text-ivory/70">
          Scroll
        </span>
        <motion.span
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-ivory/80 to-transparent"
        />
      </motion.div>
    </section>
  );
}
