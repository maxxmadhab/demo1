import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block font-body text-[0.68rem] font-medium uppercase tracking-[0.18em] text-stone"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full border border-charcoal/15 bg-white px-4 py-3 font-body text-sm text-charcoal",
          "placeholder:text-mist",
          "transition-colors duration-300 focus:border-gold focus:outline-none",
          error && "border-red-400",
          className,
        )}
        {...props}
      />
      {error && <p className="font-body text-xs text-red-500">{error}</p>}
    </div>
  );
}
