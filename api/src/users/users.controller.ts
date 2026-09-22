import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { JwtPayload } from '../auth/jwt.strategy.js';
import { PrismaService } from '../prisma/prisma.service.js';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  async me(@CurrentUser() user: JwtPayload) {
    const record = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { tenant: true },
    });
    if (!record) {
      throw new NotFoundException('User not found');
    }
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role,
      organization: { id: record.tenant.id, name: record.tenant.name, slug: record.tenant.slug },
    };
  }

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const users = await this.prisma.user.findMany({
      where: { tenantId: user.tenantId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return users;
  }
}
