import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

export function Button({
  children,
  to,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  ariaLabel,
}: ButtonProps) {
  const reducedMotion = useReducedMotion();
  const base = cn(
    "group inline-flex items-center justify-center gap-2.5 font-body font-medium tracking-[0.14em] uppercase transition-colors duration-300",
    "disabled:opacity-50",
    variant === "primary" && "bg-charcoal text-ivory hover:bg-charcoal-light",
    variant === "outline" && "border border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory",
    variant === "ghost" && "text-charcoal hover:text-gold-deep",
    variant === "light" && "bg-ivory text-charcoal hover:bg-white",
    size === "sm" && "px-4 py-2.5 text-[0.68rem]",
    size === "md" && "px-7 py-3.5 text-[0.72rem]",
    size === "lg" && "px-9 py-4 text-[0.78rem]",
    className
  );

  const content = <span className="inline-flex items-center gap-2.5">{children}</span>;

  if (to) {
    if (disabled) {
      return <span className={cn(base, "pointer-events-none opacity-50")}>{content}</span>;
    }
    return (
      <motion.span
        whileHover={reducedMotion ? undefined : { y: -1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        className="inline-flex"
      >
        <Link to={to} className={base} aria-label={ariaLabel}>
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      whileHover={reducedMotion ? undefined : { y: -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={base}
    >
      {content}
    </motion.button>
  );
}