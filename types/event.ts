import { z } from 'zod';
import { reminderSchema } from '@/types/reminder';
import { timestamp } from '@/util/parse/timestamp';

export const notificationUnitOptions = ['minutes', 'hours', 'days', 'weeks'] as const;

export type NotificationUnitOptions = (typeof notificationUnitOptions)[number];

export const eventFormSchema = z.object({
	name: z.string().min(3, 'Minimum event name is 3 characters'),
	description: z.string(),
	time: z
		.object({
			start: z.date(),
			end: z.date(),
		})
		.refine((values) => values.end.valueOf() > values.start.valueOf(), {
			message: 'End time must be before start time',
		}),
	allDay: z.boolean(),
	notification: z.object({
		duration: z.number(),
		unit: z.enum(notificationUnitOptions, {
			errorMap: (issue, _ctx) => ({
				code: 'invalid_type',
				message: 'Must be minutes, hours, days, or weeks',
				path: ['notification.unit'],
			}),
		}),
	}),
	label: z.object({
		name: z.string(),
		color: z
			.string()
			.min(4)
			.max(9)
			.regex(/^#?([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i, 'Color must be of length 4, 7, or 9 (including #)'),
	}),
	location: z.string().nullable(),
});

export type EventForm = z.infer<typeof eventFormSchema>;

export const eventSchema = eventFormSchema.merge(
	z.object({
		id: z.string().uuid({ message: 'Not a valid UUID' }),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
);

export type Event = z.infer<typeof eventSchema>;

export const eventFetchSchema = reminderSchema.merge(
	z.object({
		time: z.object({
			start: timestamp,
			end: timestamp,
		}),
		createdAt: timestamp,
		updatedAt: timestamp,
	})
);

export type EventFetch = z.infer<typeof eventFetchSchema>;
