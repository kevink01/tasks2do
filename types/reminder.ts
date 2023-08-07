import { z } from 'zod';

export const reminderFormSchema = z.object({
	name: z.string().min(3, 'Minimum reminder name is 3 characters'),
	description: z.string(),
	complete: z.date().min(new Date(), { message: 'Date must be in the future' }),
	allDay: z.boolean(),
});

export type ReminderForm = z.infer<typeof reminderFormSchema>;

export const reminderSchema = reminderFormSchema.merge(
	z.object({
		id: z.string().uuid({ message: 'Not a valid UUID' }),
		created: z.date(),
		updated: z.date(),
	})
);

export type Reminder = z.infer<typeof reminderSchema>;

export const reminderFetchSchema = reminderSchema.merge(
	z.object({
		complete: z.object({ seconds: z.number(), nanoseconds: z.number() }),
		created: z.object({ seconds: z.number(), nanoseconds: z.number() }),
		updated: z.object({ seconds: z.number(), nanoseconds: z.number() }),
	})
);

export type ReminderFetch = z.infer<typeof reminderFetchSchema>;
