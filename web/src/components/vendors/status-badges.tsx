import { Badge } from "@/components/ui/badge";
import type { DocumentStatus, VendorStatus } from "@/lib/types";

const vendorStatusConfig: Record<VendorStatus, { label: string; tone: "success" | "danger" | "neutral" }> = {
  ACTIVE: { label: "Active", tone: "success" },
  AT_RISK: { label: "At risk", tone: "danger" },
  OFFBOARDED: { label: "Offboarded", tone: "neutral" },
};

export function VendorStatusBadge({ status }: { status: VendorStatus }) {
  const config = vendorStatusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

const documentStatusConfig: Record<DocumentStatus, { label: string; tone: "success" | "warning" | "danger" }> = {
  VALID: { label: "Valid", tone: "success" },
  EXPIRING_SOON: { label: "Expiring soon", tone: "warning" },
  EXPIRED: { label: "Expired", tone: "danger" },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const config = documentStatusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export function RiskScoreBadge({ score }: { score: number }) {
  const tone = score > 66 ? "danger" : score > 33 ? "warning" : "success";
  return <Badge tone={tone}>Risk {score}</Badge>;
}
