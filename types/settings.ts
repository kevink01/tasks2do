import { z } from 'zod';

export const notificationThemeOptions = ['light', 'dark', 'colored'] as const;
export const notificationLocationOptions = [
	'top-left',
	'top-center',
	'top-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
] as const;

export type NotificationLocation = (typeof notificationLocationOptions)[number];
export type NotificationTheme = (typeof notificationThemeOptions)[number];

export const settingsSchema = z.object({
	notification: z.object({
		enabled: z.boolean(),
		duration: z.number().min(1).max(5),
		location: z.enum(notificationLocationOptions),
		theme: z.enum(notificationThemeOptions),
	}),
});

export type Settings = z.infer<typeof settingsSchema>;
