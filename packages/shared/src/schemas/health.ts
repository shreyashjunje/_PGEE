import { z } from 'zod';

/** Body of GET /health. When the database is down the API answers 503 with an ApiError instead. */
export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  database: z.literal('up'),
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
