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
import { getBeginningOfDate } from '@/util/time';

type ReminderCreateDateProps = {
	current: Date | null;
	previous: Date | null;
};

export default function ReminderCreate() {
	useProtectedRoute();
	const { settings, loading } = useSettings();

	const router = useRouter();

	const [dates, setDates] = useState<ReminderCreateDateProps>({ current: null, previous: null });
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
		if (!dates.current) {
			setError('dueDate', { message: 'Please enter a date', type: 'required' });
			return;
		}
		register('dueDate', { value: checked ? moment(dates.current).startOf('day').toDate() : dates.current });
		register('allDay', { value: checked });
		register('isCompleted', { value: false });
		register('completedAt', { value: null });
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
									message: 'Minimum length is 3',
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
								All day reminder
							</Text>
							<Switch
								checked={checked}
								onClick={() => {
									setDates({
										current: checked ? dates.previous : dates.previous ? getBeginningOfDate(dates.previous) : null,
										previous: dates.current,
									});
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
								setDates({ current: e, previous: dates.current });
								clearErrors('dueDate');
							}}
							error={errors.dueDate?.message}
							disabled={checked && dates.current !== null}
							value={dates.current}
						/>
					</Stack>
					<Center mt={rem(10)}>
						<Button type='submit' color='orange'>
							Create reminder
						</Button>
					</Center>
				</Box>
			</form>
		</Container>
	);
}
