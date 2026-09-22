import { PageHeader } from "@/components/shell/page-header";
import { AddDocumentDialog } from "@/components/vendors/add-document-dialog";
import { DocumentStatusBadge, RiskScoreBadge, VendorStatusBadge } from "@/components/vendors/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError, serverFetch } from "@/lib/api-server";
import type { Vendor } from "@/lib/types";
import { format } from "date-fns";
import { FileText, Mail, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let vendor: Vendor | null;
  try {
    vendor = await serverFetch<Vendor>(`vendors/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  if (!vendor) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={vendor.name}
        description={`Added ${format(new Date(vendor.createdAt), "MMM d, yyyy")}`}
        actions={<AddDocumentDialog vendorId={vendor.id} />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 text-ink-700">
              <Tag className="h-4 w-4 text-ink-400" />
              {vendor.category}
            </div>
            <div className="flex items-center gap-2 text-ink-700">
              <Mail className="h-4 w-4 text-ink-400" />
              {vendor.contactEmail}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <VendorStatusBadge status={vendor.status} />
              <RiskScoreBadge score={vendor.riskScore} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance documents</CardTitle>
          </CardHeader>
          <CardContent>
            {vendor.documents.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No documents yet"
                description="Add an insurance certificate, SOC 2 report, or contract to start tracking expirations."
              />
            ) : (
              <ul className="divide-y divide-border">
                {[...vendor.documents]
                  .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())
                  .map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">{doc.fileName}</p>
                        <p className="text-xs text-ink-500">
                          {doc.type.replaceAll("_", " ")} · expires{" "}
                          {format(new Date(doc.expiresAt), "MMM d, yyyy")}
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
