import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaQuestionCircle, FaExclamation, FaCalendarCheck } from 'react-icons/fa';
import {
	Alert,
	Button,
	Card,
	Container,
	Divider,
	Flex,
	Group,
	Stack,
	Switch,
	Text,
	TextInput,
	rem,
} from '@mantine/core';
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

type UpdateTaskDates = {
	dueDate: Date;
	completedDate: Date | null;
};

export default function UpdateTask({ task, settings, promptDeleteTask, toggleEditMode }: UpdateTaskProps) {
	const { updateTask } = useTasks();
	const [dates, setDates] = useState<UpdateTaskDates>({
		dueDate: getDate(task.dueDate),
		completedDate: task.completedDate ? getDate(task.completedDate) : null,
	});
	const [completed, setCompleted] = useState<boolean>(task.isCompleted);

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
			dueDate: getDate(task.dueDate),
			isCompleted: task.isCompleted,
			completedDate: task.completedDate ? getDate(task.completedDate) : null,
		},
	});

	const toggleCompleted = () => {
		if (!completed) {
			setDates({ ...dates, completedDate: task.completedDate ? getDate(task.completedDate) : new Date() });
		}
		setCompleted((checked) => !checked);
	};

	const promptUpdateTask = () => {
		const formValues = getValues();
		const noChanges =
			task.name === formValues.name &&
			task.description === formValues.description &&
			task.isCompleted === formValues.isCompleted &&
			getDate(task.dueDate).valueOf() === dates.dueDate.valueOf() &&
			(task.completedDate
				? dates.completedDate
					? getDate(task.completedDate).valueOf() === dates.completedDate.valueOf()
					: false
				: dates.completedDate === null);
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
						{getDate(task.dueDate).valueOf() !== dates.dueDate.valueOf() && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Due date</Text>
								<Text>Old value: {getDate(task.dueDate).toLocaleString()}</Text>
								<Text>New value: {dates.dueDate.toLocaleString()}</Text>
							</Stack>
						)}
						{task.isCompleted !== formValues.isCompleted && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Is completed</Text>
								<Text>Old value: {task.isCompleted ? 'Yes' : 'No'}</Text>
								<Text>New value: {formValues.isCompleted ? 'Yes' : 'No'}</Text>
							</Stack>
						)}
						{(task.completedDate
							? dates.completedDate
								? getDate(task.completedDate).valueOf() !== dates.completedDate.valueOf()
								: true
							: dates.completedDate !== null) && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Completed date</Text>
								{task.completedDate && <Text>Old value: {getDate(task.completedDate).toLocaleString()}</Text>}
								{dates.completedDate && <Text>New value: {dates.completedDate.toLocaleString()}</Text>}
								{!task.completedDate && <Text fs='italic'>(No previous date)</Text>}
								{!dates.completedDate && <Text fs='iatlic'>(No more completion date)</Text>}
							</Stack>
						)}
					</Stack>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: noChanges },
			onConfirm: () => {
				setValue('isCompleted', completed);
				setValue('dueDate', dates.dueDate);
				setValue('completedDate', completed ? (task.completedDate ? dates.completedDate : new Date()) : null);
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
				setValue('name', task.name);
				setValue('description', task.description);
				setValue('isCompleted', task.isCompleted);
				setCompleted(task.isCompleted);
				setValue('dueDate', getDate(task.dueDate));
				setValue('completedDate', task.completedDate ? getDate(task.completedDate) : null);
				setDates({
					dueDate: getDate(task.dueDate),
					completedDate: task.completedDate ? getDate(task.completedDate) : null,
				});
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
				setValue('isCompleted', task.isCompleted);
				const resetDates: UpdateTaskDates = {
					dueDate: getDate(task.dueDate),
					completedDate: task.completedDate ? getDate(task.completedDate) : null,
				};
				setValue('dueDate', resetDates.dueDate);
				setValue('completedDate', resetDates.completedDate);
				setDates({
					dueDate: resetDates.dueDate,
					completedDate: resetDates.completedDate,
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
			<Card.Section mx={rem(4)} pt={rem(4)}>
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
						if (e) {
							setDates({ dueDate: new Date(e.valueOf()), completedDate: dates.completedDate });
						}
					}}
					defaultValue={getDate(task.dueDate)}
				/>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section mx={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Stack spacing={0}>
						<Group spacing={5}>
							<Text size='sm' color='white'>
								Task completed
							</Text>
							<Text color='red'>*</Text>
						</Group>
						<Switch checked={completed} onClick={toggleCompleted} />
					</Stack>
					<DateTimePicker
						label='Completion date'
						withAsterisk
						dropdownType='modal'
						modalProps={{ centered: true }}
						valueFormat='MM/DD/YYYY hh:mm A'
						firstDayOfWeek={0}
						disabled={completed && task.completedDate !== null}
						value={dates.completedDate}
						clearable
						clearButtonProps={{
							onClick: () => {
								if (completed) {
									setCompleted(false);
								}
								setDates({ ...dates, completedDate: null });
								console.log(dates);
							},
						}}
					/>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section mx={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='green' onClick={promptUpdateTask}>
						Confirm changes
					</Button>
					<Button color='blue' onClick={promptResetChanges}>
						Reset changes
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
