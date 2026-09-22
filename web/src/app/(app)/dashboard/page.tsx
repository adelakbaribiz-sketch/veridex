import { PageHeader } from "@/components/shell/page-header";
import { RiskDistributionChart } from "@/components/dashboard/risk-distribution-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentStatusBadge } from "@/components/vendors/status-badges";
import { serverFetch } from "@/lib/api-server";
import type { DashboardSummary, Vendor } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Building2, FileWarning, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [summary, vendors] = await Promise.all([
    serverFetch<DashboardSummary>("dashboard/summary"),
    serverFetch<Vendor[]>("vendors"),
  ]);

  const expiringDocuments = (vendors ?? [])
    .flatMap((vendor) =>
      vendor.documents
        .filter((doc) => doc.status !== "VALID")
        .map((doc) => ({ ...doc, vendorName: vendor.name, vendorId: vendor.id })),
    )
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A live snapshot of vendor compliance risk across your organization."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total vendors" value={summary?.totalVendors ?? 0} icon={Building2} />
        <KpiCard
          label="Vendors at risk"
          value={summary?.atRiskVendors ?? 0}
          icon={ShieldAlert}
          tone="danger"
          elevated
        />
        <KpiCard
          label="Documents expiring soon"
          value={summary?.documentsExpiringSoon ?? 0}
          icon={AlertTriangle}
          tone="warning"
        />
        <KpiCard
          label="Documents expired"
          value={summary?.documentsExpired ?? 0}
          icon={FileWarning}
          tone="danger"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Vendor risk distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {summary && summary.totalVendors > 0 ? (
              <RiskDistributionChart distribution={summary.riskDistribution} />
            ) : (
              <p className="py-10 text-center text-sm text-ink-500">
                No vendors yet — add one to see your risk distribution.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
          </CardHeader>
          <CardContent>
            {expiringDocuments.length === 0 ? (
              <EmptyState
                icon={FileWarning}
                title="Nothing expiring"
                description="No compliance documents are expiring soon or overdue."
              />
            ) : (
              <ul className="divide-y divide-border">
                {expiringDocuments.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/vendors/${doc.vendorId}`}
                        className="truncate text-sm font-medium text-ink-900 hover:text-brand-700"
                      >
                        {doc.vendorName}
                      </Link>
                      <p className="truncate text-xs text-ink-500">
                        {doc.type.replaceAll("_", " ")} ·{" "}
                        {doc.status === "EXPIRED" ? "expired" : "expires"}{" "}
                        {formatDistanceToNow(new Date(doc.expiresAt), { addSuffix: true })}
                      </p>
                    </div>
                    <DocumentStatusBadge status={doc.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
