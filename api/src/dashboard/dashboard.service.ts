import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { computeDocumentStatus } from '../vendors/document-status.util.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(tenantId: string) {
    const [vendors, documents] = await Promise.all([
      this.prisma.vendor.findMany({ where: { tenantId } }),
      this.prisma.complianceDocument.findMany({ where: { tenantId } }),
    ]);

    const activeVendors = vendors.filter((v) => v.status === 'ACTIVE').length;
    const atRiskVendors = vendors.filter((v) => v.status === 'AT_RISK').length;
    const offboardedVendors = vendors.filter((v) => v.status === 'OFFBOARDED').length;

    const avgRiskScore = vendors.length
      ? Math.round(vendors.reduce((sum, v) => sum + v.riskScore, 0) / vendors.length)
      : 0;

    const riskDistribution = {
      low: vendors.filter((v) => v.riskScore <= 33).length,
      medium: vendors.filter((v) => v.riskScore > 33 && v.riskScore <= 66).length,
      high: vendors.filter((v) => v.riskScore > 66).length,
    };

    const statuses = documents.map((d) => computeDocumentStatus(d.expiresAt));
    const documentsExpiringSoon = statuses.filter((s) => s === 'EXPIRING_SOON').length;
    const documentsExpired = statuses.filter((s) => s === 'EXPIRED').length;

    return {
      totalVendors: vendors.length,
      activeVendors,
      atRiskVendors,
      offboardedVendors,
      avgRiskScore,
      riskDistribution,
      documentsExpiringSoon,
      documentsExpired,
      totalDocuments: documents.length,
    };
  }
}
