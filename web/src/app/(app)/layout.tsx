import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { serverFetch } from "@/lib/api-server";
import type { CurrentUser } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await serverFetch<CurrentUser>("users/me");

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 bg-canvas px-6 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
