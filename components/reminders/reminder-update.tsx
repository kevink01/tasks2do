'use client';

import useReminders from '@/hooks/use-reminders';
import { ReminderFetch, ReminderForm } from '@/types/reminder';
import { Settings } from '@/types/settings';
import { notify, updateNotification } from '@/util/notifications/notify';
import { getBeginningOfDate, getBeginningOfDay, getDate } from '@/util/time';
import {
	Alert,
	Container,
	Stack,
	rem,
	Text,
	Button,
	Group,
	Card,
	Divider,
	Flex,
	TextInput,
	Switch,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCalendarCheck, FaExclamation, FaQuestionCircle } from 'react-icons/fa';

type DateProps = {
	current: Date;
	previous: Date;
};

type UpdateReminderProps = {
	reminder: ReminderFetch;
	settings: Settings;

	promptDeleteReminder: () => void;
	toggleEditMode: (mode?: boolean) => void;
};

export default function UpdateReminder({
	reminder,
	settings,
	promptDeleteReminder,
	toggleEditMode,
}: UpdateReminderProps) {
	const { updateReminder } = useReminders();
	const [dates, setDates] = useState<DateProps>({
		current: getDate(reminder.complete),
		previous: getDate(reminder.complete),
	});
	const [allDay, setAllDay] = useState<boolean>(reminder.allDay);
	const router = useRouter();
	const {
		getValues,
		setValue,
		register,
		formState: { errors },
	} = useForm<ReminderForm>({
		defaultValues: {
			name: reminder.name,
			description: reminder.description,
			allDay: reminder.allDay,
			complete: getDate(reminder.complete),
		},
	});

	const toggleAllDay = () => {
		setDates((values) => ({
			previous: values.current,
			current: allDay ? values.previous! : getBeginningOfDate(values.current),
		}));
		setAllDay((mode) => !mode);
		console.log(dates);
	};

	const promptUpdateReminder = () => {
		const formValues = getValues();
		const noChanges =
			reminder.name === formValues.name &&
			reminder.description === formValues.description &&
			reminder.allDay === allDay &&
			getDate(reminder.complete).valueOf() === (dates.current?.valueOf() ?? formValues.complete.valueOf());
		modals.openConfirmModal({
			centered: true,
			title: 'Updating task',
			children: (
				<Container>
					{noChanges ? (
						<Alert icon={<FaQuestionCircle />} title='No changes were made' color='orange' radius='xs' mb={rem(4)}>
							This reminder is the same. Please make some changes if you want to update.
						</Alert>
					) : (
						<Alert
							icon={<FaExclamation />}
							title='Do you want to confirm these changes'
							color='yellow'
							radius='xs'
							mb={rem(4)}>
							We do not keep the history of reminder changes. Confirming these changes are permanent.
						</Alert>
					)}
					<Stack>
						{reminder.name !== formValues.name && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Name</Text>
								<Text>Old value: {reminder.name ?? ''}</Text>
								<Text>New value: {formValues.name}</Text>
							</Stack>
						)}
						{reminder.description !== formValues.description && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Description</Text>
								<Text>Old value: {reminder.description ?? ''}</Text>
								<Text>New value: {formValues.description}</Text>
							</Stack>
						)}
						{reminder.allDay !== allDay && (
							<Stack spacing='xs'>
								<Text c='dimmed'>All day</Text>
								<Text>Old value: {reminder.allDay ? 'true' : 'false'}</Text>
								<Text>New value: {allDay ? 'true' : 'false'}</Text>
							</Stack>
						)}
						{getDate(reminder.complete).valueOf() !== (dates.current.valueOf() ?? formValues.complete.valueOf()) && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Complete date</Text>
								<Text>
									Old value: {reminder ? getDate(reminder.complete).toLocaleString() : new Date().toLocaleString()}
								</Text>
								<Text>
									New value: {dates.current ? dates.current.toLocaleString() : formValues.complete.toLocaleString()}
								</Text>
							</Stack>
						)}
					</Stack>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: noChanges },
			onConfirm: () => {
				setValue('complete', dates.current);
				setValue('allDay', allDay);
				const id = notify(
					`update-reminder-${reminder.id}`,
					`Updating reminder: ${reminder.name}`,
					'Your data will be loaded',
					true,
					settings,
					'info'
				);
				const result = updateReminder(reminder, getValues());
				if (result.success) {
					updateNotification(id, 'Success!', 'Successfully updated reminder', settings, 'success', <FaCalendarCheck />);
					router.push('/reminders');
				} else {
					updateNotification(id, 'Error!', 'Unable to update reminder', settings, 'error');
				}
			},
		});
	};

	const promptCancelChanges = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Canceling changes',
			children: (
				<Container>
					<Alert
						icon={<FaExclamation />}
						title='Are you sure you want to cancel changes?'
						color='yellow'
						radius='xs'
						mb={rem(4)}>
						This action cannot be undone
					</Alert>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: !reminder },
			onConfirm: () => {
				setValue('name', reminder.name);
				setValue('description', reminder.description);
				const resetDate = getDate(reminder.complete);
				setValue('complete', resetDate);
				setDates({ current: resetDate, previous: resetDate });
				toggleEditMode(false);
			},
		});
	};

	return (
		<div>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column' gap='xs'>
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
					<TextInput
						placeholder='Task description'
						label='Description'
						radius='md'
						size='md'
						error={errors.description?.message}
						{...register('description')}
					/>
				</Flex>
			</Card.Section>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Stack spacing={0}>
					<Group spacing={5}>
						<Text size='sm' color='white'>
							All day
						</Text>
						<Text color='red'>*</Text>
					</Group>
					<Switch checked={allDay} onClick={toggleAllDay} />
				</Stack>

				<DateTimePicker
					label='Completion date'
					placeholder='Pick date and time'
					withAsterisk
					dropdownType='modal'
					modalProps={{ centered: true }}
					valueFormat='MM/DD/YYYY hh:mm A'
					minDate={new Date()}
					firstDayOfWeek={0}
					onChange={(e) => {
						setDates((values) => ({ previous: values.current, current: new Date(e!.getTime()) }));
						console.log(dates);
					}}
					defaultValue={getDate(reminder.complete)}
					disabled={allDay}
					value={dates.current}
				/>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='green' onClick={promptUpdateReminder}>
						Confirm changes
					</Button>
					<Button color='yellow' onClick={promptCancelChanges}>
						Discard changes
					</Button>
					<Button color='red' onClick={promptDeleteReminder}>
						Delete task
					</Button>
				</Group>
			</Card.Section>
		</div>
	);
}
