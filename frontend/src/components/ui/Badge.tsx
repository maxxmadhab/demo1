import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

type BadgeTone = "gold" | "dark" | "light";

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  as?: "span" | "link";
  to?: string;
}

export function Badge({ children, tone = "dark", className, as = "span", to }: BadgeProps) {
  const base = cn(
    "inline-flex items-center gap-1 font-body text-[0.65rem] font-medium uppercase tracking-[0.18em]",
    tone === "gold" && "bg-gold/90 text-ivory",
    tone === "dark" && "bg-charcoal/85 text-ivory backdrop-blur-sm",
    tone === "light" && "bg-ivory/90 text-charcoal backdrop-blur-sm",
    "px-2.5 py-1",
    className
  );

  if (as === "link" && to) {
    return (
      <Link to={to} className={base}>
        {children}
      </Link>
    );
  }

  return <span className={base}>{children}</span>;
}