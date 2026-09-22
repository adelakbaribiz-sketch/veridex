import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { VendorsService } from './vendors.service.js';

function makePrismaMock() {
  return {
    vendor: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    complianceDocument: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  } as unknown as PrismaService;
}

const user = { sub: 'user-1', tenantId: 'tenant-1', role: 'ADMIN' };

describe('VendorsService', () => {
  let prisma: ReturnType<typeof makePrismaMock>;
  let service: VendorsService;

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new VendorsService(prisma);
  });

  it('throws NotFoundException when a vendor is not in the caller tenant', async () => {
    (prisma.vendor.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(service.findOne('tenant-1', 'vendor-in-other-tenant')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.vendor.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'vendor-in-other-tenant', tenantId: 'tenant-1' } }),
    );
  });

  it('scopes vendor creation to the caller tenant and writes an audit log', async () => {
    (prisma.vendor.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'vendor-1',
      tenantId: 'tenant-1',
      name: 'Acme Supply',
    });

    await service.create(user, {
      name: 'Acme Supply',
      category: 'Logistics',
      contactEmail: 'ops@acme.com',
    });

    expect(prisma.vendor.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ tenantId: 'tenant-1' }) }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'vendor.created', tenantId: 'tenant-1' }),
      }),
    );
  });

  it('recomputes document status from expiresAt instead of trusting stored status', async () => {
    const expired = new Date(Date.now() - 24 * 60 * 60 * 1000);
    (prisma.vendor.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'vendor-1',
      tenantId: 'tenant-1',
      documents: [{ id: 'doc-1', expiresAt: expired, status: 'VALID' }],
    });

    const vendor = await service.findOne('tenant-1', 'vendor-1');
    expect(vendor.documents[0].status).toBe('EXPIRED');
  });
});
