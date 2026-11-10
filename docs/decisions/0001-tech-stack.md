# 0001 — Tech stack

- Status: accepted
- Date: 2026-11-11

## Decision

| Area        | Choice                                                                       |
| ----------- | ---------------------------------------------------------------------------- |
| Language    | TypeScript, strict mode, on Node.js 24 LTS                                   |
| Monorepo    | pnpm workspaces + Turborepo                                                  |
| API         | NestJS 12, REST under `/api/v1`, Swagger at `/api/docs`                      |
| Database    | PostgreSQL + Prisma                                                          |
| Web         | Next.js App Router, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form |
| Validation  | Zod; shared types are inferred from schemas in `@pg/shared`                  |
| Permissions | CASL                                                                         |
| Logging     | Pino via `nestjs-pino`, request ID on every line                             |
| Testing     | Jest + Supertest against a real PostgreSQL                                   |
| Local dev   | Docker Compose (PostgreSQL, Redis)                                           |
| CI          | GitHub Actions                                                               |

## Version choices that are not simply "latest"

Resolved from the npm registry on 2026-11-11.

- **TypeScript 6.0, not 7.0.** `typescript-eslint`, `ts-jest` and `@nestjs/swagger` do not
  accept TypeScript 7 yet. Move up when they do.
- **Prisma 7.10, not 8.** The registry's `latest` tag points at an 8.0 release candidate;
  7.10 is the newest stable release.
- **`@types/node` 24**, to match the Node.js 24 runtime.

## Consequences of the current versions

- **NestJS 12 is ESM-only**, so the API and all internal packages are ESM (`"type": "module"`,
  `.js` suffix on relative imports).
- **Jest runs in ESM mode** (`node --experimental-vm-modules`). NestJS 12 scaffolds Vitest by
  default; Jest was kept because it is the chosen test runner. If the experimental flag
  becomes a problem, Vitest is the low-friction alternative.
- **Zod validation uses NestJS's built-in `StandardSchemaValidationPipe`** instead of
  `nestjs-zod`, which does not support NestJS 12.
- **Prisma 7 needs a driver adapter and has no implicit `.env` loading.** `@pg/database`
  exports `createPrismaClient(url)` (using `@prisma/adapter-pg`) and `prisma.config.ts` loads
  the root `.env`.
- **ESLint 10**: `eslint-config-next` works, but three plugins it bundles
  (`import`, `jsx-a11y`, `react`) have not declared ESLint 10 support yet, so pnpm prints a
  peer-dependency warning.
- **pnpm 12 delays very new releases by default.** `next`, `eslint-config-next` and
  `@casl/ability` were newer than that window at setup time, so they are listed under
  `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. Remove those entries after the next
  dependency update.
