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

type UpdateReminderProps = {
	reminder: ReminderFetch;
	settings: Settings;

	promptDeleteReminder: () => void;
	toggleEditMode: (mode?: boolean) => void;
};

type UpdateReminderDates = {
	dueDate: {
		current: Date;
		previous: Date;
	};
	completedAt: Date | null;
};

export default function UpdateReminder({
	reminder,
	settings,
	promptDeleteReminder,
	toggleEditMode,
}: UpdateReminderProps) {
	const { updateReminder } = useReminders();
	const [dates, setDates] = useState<UpdateReminderDates>({
		dueDate: {
			current: getDate(reminder.dueDate),
			previous: getDate(reminder.dueDate),
		},
		completedAt: reminder.completedAt ? getDate(reminder.completedAt) : null,
	});
	const [allDay, setAllDay] = useState<boolean>(reminder.allDay);
	const [completed, setCompleted] = useState<boolean>(reminder.isCompleted);
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
			dueDate: getDate(reminder.dueDate),
			isCompleted: reminder.isCompleted,
			completedAt: reminder.completedAt ? getDate(reminder.completedAt) : null,
		},
	});

	const toggleAllDay = () => {
		setDates((values) => ({
			...dates,
			dueDate: {
				previous: values.dueDate.current,
				current: allDay ? values.dueDate.previous : getBeginningOfDate(values.dueDate.current),
			},
		}));
		setAllDay((mode) => !mode);
	};

	const toggleCompleted = () => {
		if (completed) {
			setDates({ ...dates, completedAt: null });
		} else {
			setDates({ ...dates, completedAt: reminder.completedAt ? getDate(reminder.completedAt) : new Date() });
		}
		setCompleted((checked) => !checked);
	};

	const promptResetChanges = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Resetting changes',
			children: (
				<Container>
					<Alert
						icon={<FaExclamation />}
						title='Are you sure you want to reset?'
						color='yellow'
						radius='xs'
						mb={rem(4)}>
						This action cannot be undone
					</Alert>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green' },
			onConfirm: () => {
				setValue('name', reminder.name);
				setValue('description', reminder.description);
				setValue('isCompleted', reminder.isCompleted);
				setCompleted(reminder.isCompleted);
				setValue('allDay', reminder.allDay);
				setAllDay(reminder.allDay);
				setValue('dueDate', getDate(reminder.dueDate));
				setValue('completedAt', reminder.completedAt ? getDate(reminder.completedAt) : null);
				setDates({
					dueDate: { current: getDate(reminder.dueDate), previous: getDate(reminder.dueDate) },
					completedAt: reminder.completedAt ? getDate(reminder.completedAt) : null,
				});
			},
		});
	};

	const promptUpdateReminder = () => {
		const formValues = getValues();
		const noChanges =
			reminder.name === formValues.name &&
			reminder.description === formValues.description &&
			reminder.allDay === allDay &&
			reminder.isCompleted === completed &&
			getDate(reminder.dueDate).valueOf() === dates.dueDate.current?.valueOf() &&
			(reminder.completedAt
				? dates.completedAt
					? getDate(reminder.completedAt).valueOf() === dates.completedAt.valueOf()
					: false
				: dates.completedAt === null);
		modals.openConfirmModal({
			centered: true,
			title: 'Updating reminder',
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
								<Text>Old value: {reminder.allDay ? 'Yes' : 'No'}</Text>
								<Text>New value: {allDay ? 'Yes' : 'No'}</Text>
							</Stack>
						)}
						{getDate(reminder.dueDate).valueOf() !== dates.dueDate.current.valueOf() && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Due date</Text>
								<Text>
									Old value: {reminder ? getDate(reminder.dueDate).toLocaleString() : new Date().toLocaleString()}
								</Text>
								<Text>New value: {dates.dueDate.current.toLocaleString()}</Text>
							</Stack>
						)}
						{reminder.isCompleted !== completed && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Is completed</Text>
								<Text>Old value: {reminder.isCompleted ? 'Yes' : 'No'}</Text>
								<Text>New value: {completed ? 'Yes' : 'No'}</Text>
							</Stack>
						)}
						{(reminder.completedAt
							? dates.completedAt
								? getDate(reminder.completedAt).valueOf() !== dates.completedAt.valueOf()
								: true
							: dates.completedAt !== null) && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Completed date</Text>
								{reminder.completedAt && <Text>Old value: {getDate(reminder.completedAt).toLocaleString()}</Text>}
								{dates.completedAt && <Text>New value: {dates.completedAt.toLocaleString()}</Text>}
								{!reminder.completedAt && <Text fs='italic'>(No previous date)</Text>}
								{!dates.completedAt && <Text fs='iatlic'>(No more completion date)</Text>}
							</Stack>
						)}
					</Stack>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: noChanges },
			onConfirm: () => {
				setValue('isCompleted', completed);
				setValue('dueDate', dates.dueDate.current);
				setValue('allDay', allDay);
				setValue('completedAt', completed ? (reminder.completedAt ? dates.completedAt : new Date()) : null);
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
				const resetDate = getDate(reminder.dueDate);
				setValue('dueDate', resetDate);
				setValue('completedAt', reminder.completedAt ? getDate(reminder.completedAt) : null);
				setDates({
					dueDate: { current: resetDate, previous: resetDate },
					completedAt: reminder.completedAt ? getDate(reminder.completedAt) : null,
				});
				toggleEditMode(false);
			},
		});
	};

	return (
		<div>
			<Card.Section mx={rem(4)} pt={rem(4)}>
				<Flex direction='column' gap='xs'>
					<TextInput
						placeholder='Reminder name'
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
						placeholder='Reminder description'
						label='Description'
						radius='md'
						size='md'
						error={errors.description?.message}
						{...register('description')}
					/>
				</Flex>
			</Card.Section>
			<Divider my='xs' />
			<Card.Section mx={rem(4)} pt={rem(4)}>
				<Group spacing='lg' align='top'>
					<Stack spacing={0} miw={rem(150)}>
						<Group spacing={5}>
							<Text size='sm' color='white'>
								All day
							</Text>
							<Text color='red'>*</Text>
						</Group>
						<Switch checked={allDay} onClick={toggleAllDay} />
					</Stack>
					<div className='flex-1'>
						<DateTimePicker
							label='Due date'
							placeholder='Pick date and time'
							withAsterisk
							dropdownType='modal'
							modalProps={{ centered: true }}
							valueFormat='MM/DD/YYYY hh:mm A'
							minDate={new Date()}
							firstDayOfWeek={0}
							onChange={(e) => {
								setDates((values) => ({
									...values,
									dueDate: { previous: values.dueDate.current, current: new Date(e!.getTime()) },
								}));
							}}
							defaultValue={getDate(reminder.dueDate)}
							disabled={allDay}
							value={dates.dueDate.current}
						/>
					</div>
				</Group>
			</Card.Section>
			<Divider my='xs' />
			<Card.Section mx={rem(4)} pt={rem(4)}>
				<Group spacing='lg' align='top'>
					<Stack spacing={0} miw={rem(150)}>
						<Group spacing={5}>
							<Text size='sm' color='white'>
								Reminder completed
							</Text>
							<Text color='red'>*</Text>
						</Group>
						<Switch checked={completed} onClick={toggleCompleted} />
					</Stack>
					<div className='flex-1'>
						<DateTimePicker
							label='Completion date'
							placeholder='Pick date and time'
							withAsterisk
							dropdownType='modal'
							modalProps={{ centered: true }}
							valueFormat='MM/DD/YYYY hh:mm A'
							firstDayOfWeek={0}
							disabled={!completed && reminder.completedAt === null}
							value={dates.completedAt}
							clearable
							clearButtonProps={{
								onClick: () => {
									if (completed) {
										setCompleted(false);
									}
									setDates({ ...dates, completedAt: null });
								},
							}}
						/>
					</div>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section mx={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='green' onClick={promptUpdateReminder}>
						Confirm changes
					</Button>
					<Button color='blue' onClick={promptResetChanges}>
						Reset changes
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
