import { Global, Module, type OnModuleDestroy } from '@nestjs/common';
import { createPrismaClient, PrismaClient } from '@pg/database';
import { ENV, type Env } from '../../config/env.js';

/** Provides one shared PrismaClient: `constructor(private readonly prisma: PrismaClient)`. */
@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      inject: [ENV],
      useFactory: (env: Env) => createPrismaClient(env.DATABASE_URL),
    },
  ],
  exports: [PrismaClient],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(private readonly prisma: PrismaClient) {}

  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
