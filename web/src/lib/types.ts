export type UserRole = "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER";
export type VendorStatus = "ACTIVE" | "AT_RISK" | "OFFBOARDED";
export type DocumentType = "INSURANCE_CERT" | "SOC2_REPORT" | "ISO27001" | "CONTRACT" | "OTHER";
export type DocumentStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED";

export interface ComplianceDocument {
  id: string;
  vendorId: string;
  type: DocumentType;
  fileName: string;
  issuedAt: string;
  expiresAt: string;
  status: DocumentStatus;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactEmail: string;
  riskScore: number;
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
  documents: ComplianceDocument[];
}

export interface DashboardSummary {
  totalVendors: number;
  activeVendors: number;
  atRiskVendors: number;
  offboardedVendors: number;
  avgRiskScore: number;
  riskDistribution: { low: number; medium: number; high: number };
  documentsExpiringSoon: number;
  documentsExpired: number;
  totalDocuments: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: { id: string; name: string; slug: string };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
