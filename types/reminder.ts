import { z } from 'zod';

export const reminderFormSchema = z.object({
	name: z.string().min(3, 'Minimum reminder name is 3 characters'),
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
		dueDate: z.object({ seconds: z.number(), nanoseconds: z.number() }),
		completedAt: z.object({ seconds: z.number(), nanoseconds: z.number() }).nullable(),
		createdAt: z.object({ seconds: z.number(), nanoseconds: z.number() }),
		updatedAt: z.object({ seconds: z.number(), nanoseconds: z.number() }),
	})
);

export type ReminderFetch = z.infer<typeof reminderFetchSchema>;
