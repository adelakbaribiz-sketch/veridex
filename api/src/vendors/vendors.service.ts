import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { JwtPayload } from '../auth/jwt.strategy.js';
import { computeDocumentStatus } from './document-status.util.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { CreateVendorDto } from './dto/create-vendor.dto.js';
import { UpdateVendorDto } from './dto/update-vendor.dto.js';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    const vendors = await this.prisma.vendor.findMany({
      where: { tenantId },
      include: { documents: true },
      orderBy: { createdAt: 'desc' },
    });
    return vendors.map((vendor) => this.withComputedDocumentStatus(vendor));
  }

  async findOne(tenantId: string, id: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, tenantId },
      include: { documents: true },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return this.withComputedDocumentStatus(vendor);
  }

  async addDocument(user: JwtPayload, vendorId: string, dto: CreateDocumentDto) {
    await this.findOne(user.tenantId, vendorId);
    const document = await this.prisma.complianceDocument.create({
      data: {
        tenantId: user.tenantId,
        vendorId,
        type: dto.type,
        fileName: dto.fileName,
        issuedAt: new Date(dto.issuedAt),
        expiresAt: new Date(dto.expiresAt),
        status: computeDocumentStatus(new Date(dto.expiresAt)),
      },
    });
    await this.audit(user, 'document.uploaded', document.id);
    return document;
  }

  private withComputedDocumentStatus<T extends { documents: { expiresAt: Date }[] }>(vendor: T) {
    return {
      // eslint-disable-next-line no-misused-spread -- Prisma results are plain data objects, not class instances
      ...vendor,
      documents: vendor.documents.map((doc) => ({
        ...doc,
        status: computeDocumentStatus(doc.expiresAt),
      })),
    };
  }

  async create(user: JwtPayload, dto: CreateVendorDto) {
    const vendor = await this.prisma.vendor.create({
      // eslint-disable-next-line no-misused-spread -- dto is read as plain fields by Prisma, no prototype/methods needed
      data: { ...dto, tenantId: user.tenantId },
    });
    await this.audit(user, 'vendor.created', vendor.id);
    return vendor;
  }

  async update(user: JwtPayload, id: string, dto: UpdateVendorDto) {
    await this.findOne(user.tenantId, id);
    const vendor = await this.prisma.vendor.update({
      where: { id },
      data: dto,
    });
    await this.audit(user, 'vendor.updated', vendor.id);
    return vendor;
  }

  async remove(user: JwtPayload, id: string) {
    await this.findOne(user.tenantId, id);
    await this.prisma.vendor.delete({ where: { id } });
    await this.audit(user, 'vendor.deleted', id);
    return { id };
  }

  private audit(user: JwtPayload, action: string, entityId: string) {
    return this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.sub,
        action,
        entityType: 'Vendor',
        entityId,
      },
    });
  }
}
