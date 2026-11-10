import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { apiErrorSchema, healthResponseSchema } from '@pg/shared';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { setupApp } from '../src/common/setup-app.js';

// Needs a reachable PostgreSQL at DATABASE_URL (docker compose up -d).
describe('GET /api/v1/health', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    process.env.LOG_LEVEL = 'silent';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns ok when the database is reachable', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

    expect(healthResponseSchema.parse(response.body)).toMatchObject({
      status: 'ok',
      database: 'up',
    });
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('returns the standard error shape for an unknown route', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/nope')
      .set('x-request-id', 'test-request-1')
      .expect(404);

    expect(apiErrorSchema.parse(response.body)).toMatchObject({
      statusCode: 404,
      code: 'NOT_FOUND',
      requestId: 'test-request-1',
      path: '/api/v1/nope',
    });
  });
});
