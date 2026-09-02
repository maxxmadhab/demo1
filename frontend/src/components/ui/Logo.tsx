import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Budhram — home"
      className={cn(
        "inline-flex items-baseline transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        compact ? "scale-[0.88]" : "scale-100",
        className
      )}
    >
      <span className="font-display text-[1.7rem] font-semibold leading-none tracking-[0.02em] text-charcoal">
        Budhram
      </span>
      <span
        aria-hidden="true"
        className="ml-1.5 h-[5px] w-[5px] translate-y-[-1px] rounded-full bg-gold-deep transition-all duration-500"
      />
    </Link>
  );
}
