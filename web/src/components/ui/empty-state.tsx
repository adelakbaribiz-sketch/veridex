import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100">
        <Icon className="h-5 w-5 text-brand-700" />
      </div>
      <div className="space-y-1">
        <p className="font-serif text-base font-semibold text-ink-900">{title}</p>
        <p className="max-w-sm text-sm text-ink-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
