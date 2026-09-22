import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { DashboardService } from './dashboard.service.js';

function makePrismaMock() {
  return {
    vendor: { findMany: vi.fn() },
    complianceDocument: { findMany: vi.fn() },
  } as unknown as PrismaService;
}

function vendor(overrides: Partial<{ status: string; riskScore: number }> = {}) {
  return { status: 'ACTIVE', riskScore: 0, ...overrides };
}

describe('DashboardService', () => {
  let prisma: ReturnType<typeof makePrismaMock>;
  let service: DashboardService;

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new DashboardService(prisma);
  });

  it('returns all-zero KPIs for a tenant with no vendors or documents', async () => {
    (prisma.vendor.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.complianceDocument.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const summary = await service.summary('tenant-1');

    expect(summary).toEqual({
      totalVendors: 0,
      activeVendors: 0,
      atRiskVendors: 0,
      offboardedVendors: 0,
      avgRiskScore: 0,
      riskDistribution: { low: 0, medium: 0, high: 0 },
      documentsExpiringSoon: 0,
      documentsExpired: 0,
      totalDocuments: 0,
    });
  });

  it('buckets vendors by status and by risk band correctly', async () => {
    (prisma.vendor.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      vendor({ status: 'ACTIVE', riskScore: 10 }), // low
      vendor({ status: 'ACTIVE', riskScore: 33 }), // low (boundary)
      vendor({ status: 'AT_RISK', riskScore: 34 }), // medium (boundary)
      vendor({ status: 'AT_RISK', riskScore: 90 }), // high
      vendor({ status: 'OFFBOARDED', riskScore: 67 }), // high (boundary)
    ]);
    (prisma.complianceDocument.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const summary = await service.summary('tenant-1');

    expect(summary.totalVendors).toBe(5);
    expect(summary.activeVendors).toBe(2);
    expect(summary.atRiskVendors).toBe(2);
    expect(summary.offboardedVendors).toBe(1);
    expect(summary.riskDistribution).toEqual({ low: 2, medium: 1, high: 2 });
    expect(summary.avgRiskScore).toBe(Math.round((10 + 33 + 34 + 90 + 67) / 5));
  });

  it('counts documents as expiring-soon or expired based on real expiry dates, not a stored status', async () => {
    const now = Date.now();
    const DAY = 1000 * 60 * 60 * 24;
    (prisma.vendor.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.complianceDocument.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { expiresAt: new Date(now + 10 * DAY), status: 'VALID' }, // expiring soon regardless of stored status
      { expiresAt: new Date(now - 5 * DAY), status: 'VALID' }, // expired regardless of stored status
      { expiresAt: new Date(now + 200 * DAY), status: 'VALID' }, // valid
    ]);

    const summary = await service.summary('tenant-1');

    expect(summary.totalDocuments).toBe(3);
    expect(summary.documentsExpiringSoon).toBe(1);
    expect(summary.documentsExpired).toBe(1);
  });

  it('scopes both queries to the caller tenant', async () => {
    (prisma.vendor.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.complianceDocument.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await service.summary('tenant-42');

    expect(prisma.vendor.findMany).toHaveBeenCalledWith({ where: { tenantId: 'tenant-42' } });
    expect(prisma.complianceDocument.findMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-42' },
    });
  });
});
