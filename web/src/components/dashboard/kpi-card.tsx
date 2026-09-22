import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "warning" | "danger";
}) {
  const iconTone = {
    neutral: "bg-brand-100 text-brand-700",
    warning: "bg-warning-100 text-warning-700",
    danger: "bg-danger-100 text-danger-700",
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-5">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", iconTone)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-ink-900">{value}</p>
          <p className="text-sm text-ink-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
