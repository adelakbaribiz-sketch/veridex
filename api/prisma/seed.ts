/**
 * Demo/seed data for local development and portfolio demos.
 * None of this represents a real company, vendor, or compliance record.
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const DAY = 1000 * 60 * 60 * 24;
const daysFromNow = (days: number) => new Date(Date.now() + days * DAY);

async function main() {
  const passwordHash = await bcrypt.hash('demo-password-123', 12);

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'veridex-demo' },
    update: {},
    create: {
      name: 'Veridex Demo Org',
      slug: 'veridex-demo',
      users: {
        create: {
          email: 'demo@veridex.app',
          name: 'Demo Admin',
          passwordHash,
          role: 'ADMIN',
        },
      },
    },
    include: { users: true },
  });

  const vendors = [
    { name: 'Northwind Logistics', category: 'Logistics', riskScore: 18, status: 'ACTIVE' as const },
    { name: 'Brightline Cloud Hosting', category: 'Infrastructure', riskScore: 42, status: 'ACTIVE' as const },
    { name: 'Ferro Manufacturing Co.', category: 'Manufacturing', riskScore: 71, status: 'AT_RISK' as const },
    { name: 'Solace Payroll Services', category: 'HR & Payroll', riskScore: 25, status: 'ACTIVE' as const },
    { name: 'Kestrel Data Analytics', category: 'Software', riskScore: 55, status: 'ACTIVE' as const },
    { name: 'Underline Legal Partners', category: 'Legal', riskScore: 12, status: 'ACTIVE' as const },
    { name: 'Ashgrove Facilities Mgmt', category: 'Facilities', riskScore: 84, status: 'AT_RISK' as const },
    { name: 'Pinehollow Print & Mail', category: 'Marketing Services', riskScore: 33, status: 'OFFBOARDED' as const },
  ];

  for (const [i, v] of vendors.entries()) {
    const vendor = await prisma.vendor.create({
      data: {
        tenantId: tenant.id,
        name: v.name,
        category: v.category,
        contactEmail: `contact@${v.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.example`,
        riskScore: v.riskScore,
        status: v.status,
      },
    });

    const documentPlans: { type: 'INSURANCE_CERT' | 'SOC2_REPORT' | 'ISO27001' | 'CONTRACT'; expiresInDays: number }[] = [
      { type: 'INSURANCE_CERT', expiresInDays: [90, 12, -5, 200][i % 4] },
      { type: 'CONTRACT', expiresInDays: [180, 45, 10, -20][i % 4] },
    ];
    if (i % 3 === 0) {
      documentPlans.push({ type: 'SOC2_REPORT', expiresInDays: [365, 20, -3][i % 3] });
    }

    for (const plan of documentPlans) {
      const expiresAt = daysFromNow(plan.expiresInDays);
      const status = plan.expiresInDays < 0 ? 'EXPIRED' : plan.expiresInDays <= 30 ? 'EXPIRING_SOON' : 'VALID';
      await prisma.complianceDocument.create({
        data: {
          tenantId: tenant.id,
          vendorId: vendor.id,
          type: plan.type,
          fileName: `${plan.type.toLowerCase()}-${vendor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
          issuedAt: daysFromNow(plan.expiresInDays - 365),
          expiresAt,
          status,
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: tenant.users[0].id,
      action: 'seed.completed',
      entityType: 'Tenant',
      entityId: tenant.id,
      metadata: { vendorCount: vendors.length },
    },
  });

  console.log('Seed complete. Demo login: demo@veridex.app / demo-password-123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
