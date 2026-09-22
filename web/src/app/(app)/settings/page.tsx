import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverFetch } from "@/lib/api-server";
import type { CurrentUser } from "@/lib/types";

export default async function SettingsPage() {
  const user = await serverFetch<CurrentUser>("users/me");

  return (
    <div>
      <PageHeader title="Settings" description="Your organization and account details." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">Name</p>
              <p className="text-ink-900">{user?.organization.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">Slug</p>
              <p className="text-ink-900">{user?.organization.slug}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">Name</p>
              <p className="text-ink-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">Email</p>
              <p className="text-ink-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">Role</p>
              <p className="text-ink-900">{user?.role}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-xs text-ink-500">
        Editing organization details, notification preferences, and billing are not implemented
        in this demo.
      </p>
    </div>
  );
}
