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
import { TaskForm, taskFormSchema } from '@/types/task';
import { notify, updateNotification } from '@/util/notifications/notify';
import { FaCalendarCheck } from 'react-icons/fa';

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
		const parsed = parse<TaskForm>(taskFormSchema, getValues());
		if (parsed.success) {
			const id = notify(
				`create-task-${parsed.data.name}`,
				`Creating task: ${getValues().name}`,
				'Your data will be loaded',
				true,
				settings,
				'info'
			);
			const result = createTask(parsed.data);
			if (result.success) {
				updateNotification(
					id,
					'Success!',
					`Successfully created ${result.data.name}`,
					settings,
					'success',
					<FaCalendarCheck />
				);
				router.push('/tasks');
			} else {
				updateNotification(id, 'Error!', 'Unable to create task', settings, 'error');
			}
		} else {
			notify(
				`create-task-error-${Date.now().valueOf()}`,
				'Error!',
				'Form data was not valid',
				false,
				settings,
				'error'
			);
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
									value: 3,
									message: 'Minimum length is 5',
								},
							})}
						/>
						<Textarea
							placeholder='Task description'
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
						<Button type='submit' color='orange'>
							Create task
						</Button>
					</Center>
				</Box>
			</form>
		</Container>
	);
}

export default TaskCreate;
