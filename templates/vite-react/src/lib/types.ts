import { z } from 'zod';

export const authenticatedSchema = z.boolean();

export type IsAuthenticated = z.infer<typeof authenticatedSchema>;
