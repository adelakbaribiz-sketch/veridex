import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-brand-700" />
        <span className="font-serif text-xl font-semibold text-ink-900">Veridex</span>
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        {children}
      </div>
    </div>
  );
}
