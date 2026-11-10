import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  WEB_ORIGIN: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

export type Env = z.infer<typeof envSchema>;

/** Injection token for the validated environment: `@Inject(ENV) env: Env`. */
export const ENV = Symbol('ENV');

// Local dev keeps one .env at the repo root (same depth from src/ and dist/).
// Variables that are already set (CI, production) win over the file.
const rootEnvFile = fileURLToPath(new URL('../../../../.env', import.meta.url));

/** Reads and validates the environment. Throws with one line per bad variable. */
export function loadEnv(): Env {
  // Parsed and merged by hand: process.loadEnvFile() does not reach Jest's sandboxed process.env.
  const fileEnv = existsSync(rootEnvFile) ? parseEnv(readFileSync(rootEnvFile, 'utf8')) : {};
  const result = envSchema.safeParse({ ...fileEnv, ...process.env });
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
