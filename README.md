# pg-management

Multi-tenant SaaS for managing PG (paying-guest) accommodation. This repository is a
pnpm + Turborepo monorepo: a NestJS REST API, a Next.js web app and shared packages.

> **Naming rule.** The SaaS customer is always **organization** in code. The word
> **tenant** is used only for a person renting a bed in a PG. Never use "tenant" for
> the customer account.

## Prerequisites

- Node.js 24 LTS (`.nvmrc` pins it)
- pnpm 12 — the exact version is pinned in `package.json` (`packageManager`); `corepack enable` picks it up
- Docker Desktop (for PostgreSQL and Redis)

## First-time setup

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Create your local env file:
   ```sh
   cp .env.example .env
   ```
3. Open `.env` and fill in `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, `DATABASE_URL` and
   `REDIS_URL`. The two URLs must repeat the passwords you chose (the file shows the format).
4. Start PostgreSQL and Redis and wait until both are healthy:
   ```sh
   docker compose up -d --wait
   ```
5. Apply the database migrations:
   ```sh
   pnpm db:migrate
   ```
6. Start everything:
   ```sh
   pnpm dev
   ```

Then open:

| What         | URL                                 |
| ------------ | ----------------------------------- |
| Web          | http://localhost:3000               |
| API health   | http://localhost:4000/api/v1/health |
| Swagger docs | http://localhost:4000/api/docs      |

`http://localhost:3000/admin` shows the API health check end to end (web → api-client → API → database).

## Scripts

Run from the repo root.

| Script            | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Runs the API, the web app and the package watchers   |
| `pnpm build`      | Builds every package and app                         |
| `pnpm lint`       | ESLint everywhere                                    |
| `pnpm typecheck`  | `tsc --noEmit` everywhere                            |
| `pnpm test`       | Jest + Supertest (needs PostgreSQL running)          |
| `pnpm format`     | Prettier over the whole repo                         |
| `pnpm db:migrate` | Creates and applies Prisma migrations in development |
| `pnpm db:seed`    | Runs the seed script (empty for now)                 |
| `pnpm db:studio`  | Opens Prisma Studio                                  |

`dev`, `build`, `lint`, `typecheck` and `test` run through Turborepo. A pre-commit hook
(Husky + lint-staged) lints and formats staged files.

## Folder structure

```
apps/
  api/                 NestJS REST API (prefix /api/v1, Swagger at /api/docs)
    src/modules/       One folder per feature (only "health" so far)
    src/common/        Cross-cutting code: filters, guards, interceptors, decorators, database module
    src/config/        Environment validation with Zod; the API refuses to start on a bad .env
    test/              Supertest e2e tests
  web/                 Next.js App Router app (Tailwind, shadcn/ui, TanStack Query)
    src/app/(auth)/    Sign-in pages (/login)
    src/app/(admin)/   Super admin area (/admin), placeholder
    src/app/(owner)/   Owner and staff area (/dashboard), placeholder
    src/components/    UI components; shadcn/ui lives in components/ui
    src/lib/           The API client instance and helpers
  mobile/              Expo app, added in Phase 3 (README only)
packages/
  shared/              Zod schemas, types inferred from them, constants
  permissions/         CASL ability factory and role-permission map (placeholder)
  database/            Prisma schema, migrations, seed and client export — import only from apps/api
  api-client/          Typed fetch client used by web and mobile
  eslint-config/       Shared ESLint configs (base, nest, next)
  typescript-config/   Shared tsconfig bases
infrastructure/docker/ Production Dockerfile for the API
docs/                  Architecture notes and decision records
.github/workflows/     CI: lint, typecheck, test, build
```

## Conventions

- **Types come from Zod.** There is no types package. Define a schema in `@pg/shared` and
  export `z.infer<typeof schema>` next to it.
- **Only `apps/api` imports `@pg/database`.** ESLint blocks it everywhere else; other code
  talks to the API through `@pg/api-client`.
- **One error shape.** Every API error is
  `{ statusCode, code, message, requestId, timestamp, path }`.
- **Debugging.** Every response carries an `x-request-id` header and every log line written
  during that request has the same `requestId`. Search the logs for it.

More detail: [docs/architecture.md](docs/architecture.md).
