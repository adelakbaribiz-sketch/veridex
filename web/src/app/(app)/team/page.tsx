import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { serverFetch } from "@/lib/api-server";
import type { TeamMember } from "@/lib/types";
import { format } from "date-fns";

const roleTone: Record<TeamMember["role"], "brand" | "neutral"> = {
  ADMIN: "brand",
  MANAGER: "neutral",
  MEMBER: "neutral",
  VIEWER: "neutral",
};

export default async function TeamPage() {
  const members = (await serverFetch<TeamMember[]>("users")) ?? [];

  return (
    <div>
      <PageHeader
        title="Team"
        description="Everyone with access to your Veridex organization."
        actions={
          <Button variant="secondary" disabled title="Invitations aren't implemented in this demo">
            Invite member
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-5 py-3 font-medium text-ink-900">{member.name}</td>
                  <td className="px-5 py-3 text-ink-700">{member.email}</td>
                  <td className="px-5 py-3">
                    <Badge tone={roleTone[member.role]}>{member.role}</Badge>
                  </td>
                  <td className="px-5 py-3 text-ink-500">
                    {format(new Date(member.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-ink-500">
        Team invitations, role changes, and permission management are not implemented in this
        demo — see the project&apos;s ROADMAP.md for what a production version would add.
      </p>
    </div>
  );
}
