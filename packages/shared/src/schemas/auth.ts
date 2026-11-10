import { z } from 'zod';

/** Placeholder: only drives the login form for now. Auth is not implemented yet. */
export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export type LoginInput = z.infer<typeof loginSchema>;
