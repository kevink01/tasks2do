'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Card, Center, Container, LoadingOverlay, Stack, TextInput, Textarea, rem } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from 'react-hook-form';
import { useProtectedRoute } from '@/hooks/auth';
import { useSettings } from '@/hooks/use-settings';
import { useTasks } from '@/hooks/use-tasks';
import { parse } from '@/types/parse';
import { TaskForm, taskFormSchema } from '@/types/tasks';
import { notify } from '@/util/notify';

function TaskCreate() {
	useProtectedRoute();
	const { settings, loading } = useSettings();

	const router = useRouter();

	const [date, setDate] = useState<Date | null>();
	const {
		clearErrors,
		getValues,
		handleSubmit,
		register,
		setError,
		formState: { errors },
	} = useForm<TaskForm>();

	const { createTask } = useTasks();

	const submit = () => {
		if (!date) {
			setError('complete', { message: 'Please enter a date', type: 'required' });
			return;
		}
		register('complete', { value: date });
		const result = parse<TaskForm>(taskFormSchema, getValues());
		if (result.success) {
			const firebaseResult = createTask(result.data);
			if (firebaseResult.success) {
				notify(`Successfully created task name ${firebaseResult.data.name}`, settings, 'success');
				router.push('/tasks');
			} else {
				notify(`Unable to create task`, settings, 'error');
			}
		} else {
			notify('Parsed error', settings, 'error');
		}
	};

	return (
		<Container size='md' px='xs'>
			<form onSubmit={handleSubmit(submit)}>
				<Box pos='relative'>
					<LoadingOverlay
						visible={loading}
						overlayBlur={2}
						transitionDuration={500}
						loaderProps={{ size: 'md', color: 'orange', variant: 'oval' }}
					/>
					<Stack>
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
									message: 'Minimum length is 5',
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
							withAsterisk
							label='Completion date'
							placeholder='Pick date and time'
							valueFormat='MM/DD/YYYY hh:mm A'
							dropdownType='modal'
							modalProps={{ centered: true }}
							minDate={new Date()}
							firstDayOfWeek={0}
							onChange={(e) => {
								setDate(e);
								clearErrors('complete');
							}}
							error={errors.complete?.message}
						/>
					</Stack>
					<Center mt={rem(10)}>
						<Button type='submit'>Create task</Button>
					</Center>
				</Box>
			</form>
		</Container>
	);
}

export default TaskCreate;
