import { createApiClient } from '@pg/api-client';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env at the repo root.');
}

/** The one API client for the web app. Use it inside TanStack Query hooks. */
export const api = createApiClient({ baseUrl });
