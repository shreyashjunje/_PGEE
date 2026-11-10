import type { INestApplication } from '@nestjs/common';
import { API_PREFIX } from '@pg/shared';
import { Logger } from 'nestjs-pino';
import { ENV, type Env } from '../config/env.js';

/** App-level setup shared by main.ts and the e2e tests, so tests run the real configuration. */
export function setupApp(app: INestApplication): void {
  const env = app.get<Env>(ENV);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({ origin: env.WEB_ORIGIN, credentials: true });
  app.enableShutdownHooks();
}
