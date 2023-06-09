import { z } from 'zod';

export const taskFormSchema = z.object({
	name: z.string().min(3, 'Minimum task name is 3 characters'),
	description: z.string(),
	complete: z.date().min(new Date(), { message: 'Date must be in the future' }),
});

export type TaskForm = z.infer<typeof taskFormSchema>;

export const taskSchema = taskFormSchema.merge(
	z.object({
		id: z.string().uuid({ message: 'Not a valid UUID' }),
		created: z.date(),
		updated: z.date(),
	})
);

export type Task = z.infer<typeof taskSchema>;

export const taskFetchSchema = taskSchema.merge(
	z.object({
		complete: z.object({ seconds: z.number(), nanoseconds: z.number() }),
		created: z.object({ seconds: z.number(), nanoseconds: z.number() }),
		updated: z.object({ seconds: z.number(), nanoseconds: z.number() }),
	})
);

export type TaskFetch = z.infer<typeof taskFetchSchema>;
