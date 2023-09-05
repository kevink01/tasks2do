import { z } from 'zod';
import { timestamp } from '@/util/parse/timestamp';

export const reminderFormSchema = z.object({
	name: z.string().min(5, 'Minimum reminder name is 3 characters'),
	description: z.string(),
	dueDate: z.date(),
	allDay: z.boolean(),
	isCompleted: z.boolean(),
	completedAt: z.date().min(new Date(), { message: 'Date must be in the future' }).nullable(),
});

export type ReminderForm = z.infer<typeof reminderFormSchema>;

export const reminderSchema = reminderFormSchema.merge(
	z.object({
		id: z.string().uuid({ message: 'Not a valid UUID' }),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
);

export type Reminder = z.infer<typeof reminderSchema>;

export const reminderFetchSchema = reminderSchema.merge(
	z.object({
		dueDate: timestamp,
		completedAt: timestamp.nullable(),
		createdAt: timestamp,
		updatedAt: timestamp,
	})
);

export type ReminderFetch = z.infer<typeof reminderFetchSchema>;
