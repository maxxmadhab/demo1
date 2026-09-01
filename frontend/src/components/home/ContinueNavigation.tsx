import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

interface ContinueNavigationProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  /** Dark (story) variant vs light band variant. */
  dark?: boolean;
  /** Element to scroll to for the "Explore more" action. */
  exploreTargetId?: string;
  /** Link for the "Explore more" action when a route is preferred. */
  exploreTo?: string;
  nextCollection: { name: string; to: string };
  viewAllTo?: string;
}

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function ContinueNavigation({
  eyebrow = "Continue the journey",
  title = "The story continues",
  body = "Every piece tells its own tale. Keep exploring the catalogue, or step into the next collection to see what comes next.",
  dark = false,
  exploreTargetId = "jwel-explore-more",
  exploreTo,
  nextCollection,
  viewAllTo = "/catalog",
}: ContinueNavigationProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className={cn("relative", dark ? "bg-charcoal text-ivory" : "border-t border-charcoal/[0.07] bg-ivory")}>
      <div className="container-jwel flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p
            className={cn(
              "font-body text-[0.65rem] font-medium uppercase tracking-[0.3em]",
              dark ? "text-champagne" : "text-gold-deep"
            )}
          >
            {eyebrow}
          </p>
          <h2
            className={cn(
              "mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl",
              dark ? "text-ivory" : "text-charcoal"
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-4 max-w-lg font-body text-[0.92rem] font-light leading-relaxed",
              dark ? "text-ivory/70" : "text-stone"
            )}
          >
            {body}
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3"
        >
          {exploreTo ? (
            <Button to={exploreTo} variant={dark ? "light" : "outline"}>
              Explore more <Icon name="arrow-right" size={14} />
            </Button>
          ) : (
            <Button
              variant={dark ? "light" : "outline"}
              onClick={() => scrollToId(exploreTargetId)}
            >
              Explore more <Icon name="arrow-right" size={14} />
            </Button>
          )}

          <Button to={viewAllTo} variant={dark ? "ghost" : "ghost"} className={dark ? "text-ivory hover:text-champagne" : undefined}>
            View all products <Icon name="arrow-right" size={14} />
          </Button>

          <Button to={nextCollection.to} variant={dark ? "outline" : "primary"} className={dark ? "border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal" : undefined}>
            Next collection · {nextCollection.name}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}