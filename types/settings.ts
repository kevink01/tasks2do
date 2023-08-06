import { z } from 'zod';

export const notificationThemeOptions = ['light', 'dark', 'colored'] as const;
export const notificationTypeOptions = ['success', 'info', 'warning', 'error'] as const;

export type NotificationTheme = (typeof notificationThemeOptions)[number];
export type NotificationType = (typeof notificationTypeOptions)[number];

export const settingsSchema = z.object({
	notification: z.object({
		enabled: z.boolean(),
		duration: z.number().min(1).max(5),
		theme: z.enum(notificationThemeOptions),
	}),
});

export type Settings = z.infer<typeof settingsSchema>;
