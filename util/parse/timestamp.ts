import { z } from 'zod';
export const timestamp = z.object({ seconds: z.number(), nanoseconds: z.number() });
