import { API_PREFIX, apiErrorSchema, healthResponseSchema, type ApiError } from '@pg/shared';
import type { z } from 'zod';

/** Thrown for every non-2xx response. `error.requestId` finds the matching API log lines. */
export class ApiClientError extends Error {
  constructor(readonly error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
  }
}

export function createApiClient(options: { baseUrl: string }) {
  const base = `${options.baseUrl.replace(/\/+$/, '')}/${API_PREFIX}`;

  // Responses are parsed with the shared Zod schema, so a drifting API fails loudly here.
  async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
    const response = await fetch(`${base}${path}`, init);
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const error = apiErrorSchema.safeParse(body);
      if (error.success) throw new ApiClientError(error.data);
      throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
    return schema.parse(body);
  }

  return {
    health: () => request('/health', healthResponseSchema),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
