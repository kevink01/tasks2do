import { z } from 'zod';

export const notificationThemeOptions = ['light', 'dark', 'colored'] as const;
export const notificationTypeOptions = ['success', 'info', 'warning', 'error'] as const;

export type NotificationTheme = (typeof notificationThemeOptions)[number];
export type NotificationType = (typeof notificationTypeOptions)[number];

export const labelSchema = z.object({
	name: z.string().min(1, 'Label name must have a length'),
	color: z
		.string()
		.min(4)
		.max(9)
		.regex(/^#?([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i, 'Color must be of length 4, 7, or 9 (including #)'),
});

export type Label = z.infer<typeof labelSchema>;

export const settingsSchema = z.object({
	events: z.object({
		labels: z.array(labelSchema),
	}),
	notification: z
		.object({
			enabled: z.boolean().refine((value) => value !== null, 'Test 3'),
			duration: z
				.number()
				.min(1)
				.max(5)
				.refine((value) => value !== null, 'Test 2'),
			theme: z.enum(notificationThemeOptions).refine((value) => value !== null, 'Test'),
		})
		.refine((values) => values !== null, 'Hi'),
});

export type Settings = z.infer<typeof settingsSchema>;
