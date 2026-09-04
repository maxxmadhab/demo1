import type { ReactNode } from "react";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <header className="border-b border-charcoal/10 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-charcoal">{title}</h1>
          {description && (
            <p className="mt-1 font-body text-sm font-light text-stone">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
