import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsLoading() {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-28" />
          <Skeleton className="mt-2 h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mb-4 flex gap-3">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-56" />
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="bg-brand-100/60 px-4 py-3">
          <Skeleton className="h-3 w-full max-w-md" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-t border-border px-4 py-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
