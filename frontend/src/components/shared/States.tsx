import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

interface LoadingStateProps {
  className?: string;
  label?: string;
}

export function LoadingState({ className, label = "Loading" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-4 py-24", className)}
    >
      <span className="h-10 w-10 animate-spin rounded-full border border-charcoal/15 border-t-gold-deep" />
      <span className="font-body text-xs uppercase tracking-[0.22em] text-stone">{label}</span>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-24 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand">
        <Icon name="bag" size={24} className="text-stone" />
      </div>
      <h3 className="font-display text-2xl font-medium text-charcoal">{title}</h3>
      {message && <p className="max-w-sm font-body text-sm font-light text-stone">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-24 text-center", className)}>
      <h3 className="font-display text-2xl font-medium text-charcoal">{title}</h3>
      <p className="max-w-sm font-body text-sm font-light text-stone">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-gold-deep underline underline-offset-4"
        >
          Try again
        </button>
      )}
    </div>
  );
}