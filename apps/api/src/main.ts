import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { setupApp } from './common/setup-app.js';
import { loadEnv } from './config/env.js';

// Fail fast: a bad .env stops the process here, before Nest boots, with a readable error.
const env = loadEnv();

const app = await NestFactory.create(AppModule, { bufferLogs: true });
setupApp(app);

const swaggerConfig = new DocumentBuilder().setTitle('pg-management API').setVersion('1').build();
SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig));

await app.listen(env.API_PORT);
app.get(Logger).log(`API on http://localhost:${env.API_PORT}/api/v1 (docs at /api/docs)`);
