import { motion } from "motion/react";
import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-body text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-deep">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-balance font-display text-3xl font-medium leading-tight text-charcoal sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 font-body text-[0.95rem] font-light leading-relaxed text-stone">
          {description}
        </p>
      )}
    </motion.div>
  );
}