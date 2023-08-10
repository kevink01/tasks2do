import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaQuestionCircle, FaExclamation, FaCalendarCheck } from 'react-icons/fa';
import { Alert, Button, Card, Container, Divider, Flex, Group, Stack, Text, TextInput, rem } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { modals } from '@mantine/modals';

import { useTasks } from '@/hooks/use-tasks';
import { Settings } from '@/types/settings';
import { TaskFetch, TaskForm } from '@/types/task';
import { notify, updateNotification } from '@/util/notifications/notify';
import { getDate } from '@/util/time';

type UpdateTaskProps = {
	task: TaskFetch;
	settings: Settings;

	promptDeleteTask: () => void;
	toggleEditMode: (mode?: boolean) => void;
};

export default function UpdateTask({ task, settings, promptDeleteTask, toggleEditMode }: UpdateTaskProps) {
	const { updateTask } = useTasks();
	const [date, setDate] = useState<Date | null>(getDate(task.complete));
	const router = useRouter();

	const {
		getValues,
		setValue,
		register,
		formState: { errors },
	} = useForm<TaskForm>({
		defaultValues: {
			name: task.name,
			description: task.description,
			complete: getDate(task.complete),
		},
	});

	const promptUpdateTask = () => {
		const formValues = getValues();
		const noChanges =
			task.name === formValues.name &&
			task.description === formValues.description &&
			getDate(task.complete).valueOf() === (date?.valueOf() ?? formValues.complete.valueOf());
		modals.openConfirmModal({
			centered: true,
			title: 'Updating task',
			children: (
				<Container>
					{noChanges ? (
						<Alert icon={<FaQuestionCircle />} title='No changes were made' color='orange' radius='xs' mb={rem(4)}>
							This task is the same. Please make some changes if you want to update.
						</Alert>
					) : (
						<Alert
							icon={<FaExclamation />}
							title='Do you want to confirm these changes'
							color='yellow'
							radius='xs'
							mb={rem(4)}>
							We do not keep the history of task changes. Confirming these changes are permanent.
						</Alert>
					)}
					<Stack>
						{task.name !== formValues.name && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Name</Text>
								<Text>Old value: {task.name ?? ''}</Text>
								<Text>New value: {formValues.name}</Text>
							</Stack>
						)}
						{task.description !== formValues.description && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Description</Text>
								<Text>Old value: {task.description ?? ''}</Text>
								<Text>New value: {formValues.description}</Text>
							</Stack>
						)}
						{getDate(task.complete).valueOf() !== (date?.valueOf() ?? formValues.complete.valueOf()) && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Complete date</Text>
								<Text>Old value: {task ? getDate(task.complete).toLocaleString() : new Date().toLocaleString()}</Text>
								<Text>New value: {date ? date.toLocaleString() : formValues.complete.toLocaleString()}</Text>
							</Stack>
						)}
					</Stack>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: noChanges },
			onConfirm: () => {
				date && setValue('complete', date);
				const id = notify(
					`update-task-${task.id}`,
					`Updating task: ${task.name}`,
					'Your data will be loaded',
					true,
					settings,
					'info'
				);
				const result = updateTask(task, getValues());
				if (result.success) {
					updateNotification(id, 'Success!', 'Successfully updated task', settings, 'success', <FaCalendarCheck />);
					router.push('/tasks');
				} else {
					updateNotification(id, 'Error!', 'Unable to update task', settings, 'error');
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
			confirmProps: { color: 'green', disabled: !task },
			onConfirm: () => {
				setValue('name', task.name);
				setValue('description', task.description);
				const resetDate = getDate(task.complete);
				setValue('complete', resetDate);
				setDate(resetDate);
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
						setDate(e);
					}}
					defaultValue={getDate(task.complete)}
				/>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='green' onClick={promptUpdateTask}>
						Confirm changes
					</Button>
					<Button color='yellow' onClick={promptCancelChanges}>
						Discard changes
					</Button>
					<Button color='red' onClick={promptDeleteTask}>
						Delete task
					</Button>
				</Group>
			</Card.Section>
		</div>
	);
}
