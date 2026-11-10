import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClient } from '@pg/database';
import type { HealthResponse } from '@pg/shared';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaClient) {}

  @Get()
  async check(): Promise<HealthResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (cause) {
      throw new ServiceUnavailableException('Database is unreachable', { cause });
    }
    return { status: 'ok', database: 'up', timestamp: new Date().toISOString() };
  }
}
