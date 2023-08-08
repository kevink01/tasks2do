'use client';

import { useProtectedRoute } from '@/hooks/auth';
import useReminders from '@/hooks/use-reminders';
import { useSettings } from '@/hooks/use-settings';
import { parse } from '@/types/parse';
import { ReminderForm, reminderFormSchema } from '@/types/reminder';
import { notify, updateNotification } from '@/util/notifications/notify';
import {
	Box,
	Button,
	Center,
	Container,
	LoadingOverlay,
	rem,
	Stack,
	Switch,
	Text,
	Textarea,
	TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaStickyNote } from 'react-icons/fa';

export default function ReminderCreate() {
	useProtectedRoute();
	const { settings, loading } = useSettings();

	const router = useRouter();

	const [date, setDate] = useState<Date | null>();
	const [checked, setChecked] = useState<boolean>(false);

	const {
		clearErrors,
		getValues,
		handleSubmit,
		register,
		setError,
		formState: { errors },
	} = useForm<ReminderForm>();

	const submit = () => {
		if (!date) {
			setError('complete', { message: 'Please enter a date', type: 'required' });
			return;
		}
		register('complete', { value: checked ? moment(date).startOf('day').toDate() : date });
		register('allDay', { value: checked });
		const parsed = parse<ReminderForm>(reminderFormSchema, getValues());
		if (parsed.success) {
			const id = notify(
				`create-reminder-${parsed.data.name}`,
				`Creating reminder: ${getValues().name}`,
				'Your data will be loaded',
				true,
				settings,
				'info'
			);
			const result = createReminder(parsed.data);
			if (result.success) {
				updateNotification(
					id,
					'Success!',
					`Successfully created ${result.data.name}`,
					settings,
					'success',
					<FaStickyNote />
				);
				router.push('/reminders');
			} else {
				updateNotification(id, 'Error!', 'Unable to create reminder', settings, 'error');
			}
		} else {
			notify(
				`create-reminder-error-${Date.now().valueOf()}`,
				'Error!',
				'Form data was not valid',
				false,
				settings,
				'error'
			);
		}
	};

	const { createReminder } = useReminders();

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
							placeholder='Reminder name'
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
							placeholder='Reminder description'
							label='Description'
							radius='md'
							size='md'
							autosize
							minRows={2}
							maxRows={4}
							{...register('description')}
						/>
						<Stack spacing={0}>
							<Text size='sm' color='white'>
								All day task
							</Text>
							<Switch
								checked={checked}
								onClick={() => {
									setChecked((mode) => !mode);
								}}
							/>
						</Stack>
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
							disabled={!checked}
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
