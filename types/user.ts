import { z } from 'zod';
import { settingsSchema } from './settings';

export const userSchema = z.object({
	name: z.string(),
	id: z.string(),
	email: z.string(),
	photoURL: z.string().nullish(),
	settings: settingsSchema,
});

export type User = z.infer<typeof userSchema>;
