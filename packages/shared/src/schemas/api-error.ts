import { z } from 'zod';

/** The one error shape every API failure is returned in. */
export const apiErrorSchema = z.object({
  statusCode: z.number().int(),
  /** Machine-readable code, e.g. "NOT_FOUND". */
  code: z.string(),
  message: z.string(),
  /** Matches the "requestId" field on the API log lines for this request. */
  requestId: z.string(),
  timestamp: z.iso.datetime(),
  path: z.string(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
