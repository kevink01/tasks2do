'use client';

import { useState } from 'react';
import { Button, Container, TextInput, Textarea } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from 'react-hook-form';
import { TaskForm, taskFormSchema } from '@/types/tasks';
import { parse } from '@/types/error';
import { ToastContainer, toast } from 'react-toastify';
import { useTasks } from '@/hooks/types';
// import { test } from '@/util/types/index';

function TaskCreate() {
	const [date, setDate] = useState<Date | null>();
	const {
		getValues,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TaskForm>();

	const { createTask } = useTasks();

	const submission = () => {
		register('complete', { value: new Date(date as Date) });
		const result = parse<TaskForm>(taskFormSchema, getValues());
		if (result.success) {
			const firebaseResult = createTask(result.data);
			if (firebaseResult.success) {
				toast(`Successfully created task name ${firebaseResult.data.name}`, { type: 'success' });
			} else {
				toast('Unable to create task', { type: 'error' });
			}
		} else {
			toast('Parsed error', { type: 'error' });
		}
	};

	return (
		<Container size='md' px='xs'>
			<form onSubmit={handleSubmit(submission)}>
				<TextInput
					placeholder='Task name'
					label='Name'
					radius='md'
					size='md'
					withAsterisk
					error={errors.name?.message}
					{...register('name', {
						minLength: {
							value: 5,
							message: 'Testing',
						},
					})}
				/>
				<Textarea
					placeholder='Your description'
					label='Description'
					radius='md'
					size='md'
					autosize
					minRows={2}
					maxRows={4}
					{...register('description')}
				/>
				<DateTimePicker
					valueFormat='MM/DD/YYYY hh:mm A'
					label='Completion date'
					placeholder='Pick date and time'
					minDate={new Date()}
					firstDayOfWeek={0}
					onChange={(e) => {
						setDate(e);
					}}
				/>
				<Button type='submit'>Click me</Button>
			</form>
		</Container>
	);
}

export default TaskCreate;
