"use client";

import { Button } from "@/components/ui/button";
import type { CurrentUser } from "@/lib/types";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Topbar({ user }: { user: CurrentUser }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-border bg-surface px-6">
      <div className="text-right">
        <p className="text-sm font-medium text-ink-900">{user.name}</p>
        <p className="text-xs text-ink-500">{user.organization.name}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loggingOut}>
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Signing out…" : "Sign out"}
      </Button>
    </header>
  );
}
