import { timestamp } from '@/util/parse/timestamp';
import { z } from 'zod';

export const taskFormSchema = z.object({
	name: z.string().min(3, 'Minimum task name is 3 characters'),
	description: z.string(),
	dueDate: z.date(),
	isCompleted: z.boolean(),
	completedAt: z.date().min(new Date(), { message: 'Date must be in the future' }).nullable(),
});

export type TaskForm = z.infer<typeof taskFormSchema>;

export const taskSchema = taskFormSchema.merge(
	z.object({
		id: z.string().uuid({ message: 'Not a valid UUID' }),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
);

export type Task = z.infer<typeof taskSchema>;

export const taskFetchSchema = taskSchema.merge(
	z.object({
		dueDate: timestamp,
		completedAt: timestamp.nullable(),
		createdAt: timestamp,
		updatedAt: timestamp,
	})
);

export type TaskFetch = z.infer<typeof taskFetchSchema>;
