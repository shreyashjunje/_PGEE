# Architecture

## Overview

```
apps/web ──▶ @pg/api-client ──▶ apps/api ──▶ @pg/database ──▶ PostgreSQL
    │              │               │
    └──────────────┴───────────────┴──▶ @pg/shared (Zod schemas, inferred types, constants)
```

- `apps/api` is the only code that touches the database. ESLint enforces this: the shared
  base config blocks `@pg/database` imports and only the API's config lifts the block.
- `apps/web` (and later `apps/mobile`) call the API through `@pg/api-client`, which parses
  every response with the same Zod schema the API uses for its return type.
- `@pg/permissions` holds roles and CASL abilities so the API and the clients share one
  definition. It is a placeholder until the first protected feature.

## Naming rule

The SaaS customer is always **organization**. **Tenant** means a person renting a bed in a
PG and nothing else.

## Packages are built, ESM-only

Every internal package compiles with `tsc` to `dist/` and is consumed through
`workspace:*`. Turborepo builds dependencies first (`dependsOn: ["^build"]`), so `pnpm dev`,
`lint`, `typecheck` and `test` always see fresh output. Everything is ESM because NestJS 12
is ESM-only: relative imports in the API and packages end in `.js`.

## API request lifecycle

1. `nestjs-pino` assigns a request ID (or reuses a well-formed incoming `x-request-id`),
   returns it in the `x-request-id` response header and adds `requestId` to every log line
   written during the request. Logs are pretty in development and JSON otherwise.
2. The global `StandardSchemaValidationPipe` validates any parameter declared with a Zod
   schema, for example `@Body({ schema: createThingSchema }) body: CreateThing`.
3. The controller runs.
4. `AllExceptionsFilter` turns anything thrown into
   `{ statusCode, code, message, requestId, timestamp, path }` (`ApiError` in `@pg/shared`).
   Unexpected errors return a generic message; the real error is logged with the `requestId`.

## Configuration

One `.env` at the repo root feeds Docker Compose, the API, Prisma and Next.js. Variables
already set in the environment win over the file, so CI and production never need it.
The API validates its variables with Zod at startup (`apps/api/src/config/env.ts`) and
exits with one line per invalid variable.

## Adding an API feature

1. Add request and response schemas to `packages/shared/src/schemas/` and export them.
2. Create `apps/api/src/modules/<feature>/` with a module and controller; register the
   module in `app.module.ts`. Inject `PrismaClient` from `@pg/database` for data access.
3. Add a method to `@pg/api-client` that uses the shared schema.
4. Add a Supertest e2e test in `apps/api/test/`.

## Testing

Jest + Supertest boot the real `AppModule` against a real PostgreSQL (Docker Compose locally,
a service container in CI). Jest runs in ESM mode (`--experimental-vm-modules`).
