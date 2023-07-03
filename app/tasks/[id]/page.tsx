'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getFirestore } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import {
	Alert,
	Button,
	Card,
	Container,
	Divider,
	Flex,
	Group,
	LoadingOverlay,
	Stack,
	Text,
	TextInput,
	rem,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { toast } from 'react-toastify';
import { FaExclamation, FaQuestionCircle } from 'react-icons/fa';

import { useProtectedRoute } from '@/hooks/auth';
import { useUserDocument } from '@/hooks/firestore';
import { useTasks } from '@/hooks/use-tasks';
import { TaskFetch, TaskForm } from '@/types/tasks';
import { convertToTimestamp, daysRemaining, getColor, getDate } from '@/util/time';
import TaskLoadError from './error';

type Props = {
	edit?: boolean;
};

type RequiredProps = Required<Props>;

const defaultProps: RequiredProps = {
	edit: false,
};

function TaskIDPage({ params, propsIn }: { params: { id: string }; propsIn: Props }) {
	useProtectedRoute();

	const task = useUserDocument<TaskFetch>((user) => doc(getFirestore(), `/users/${user.uid}/tasks/${params.id}`));
	const { updateTask, deleteTask } = useTasks();
	const days = task[0] ? daysRemaining(task[0].complete) : null;

	const router = useRouter();
	const props: RequiredProps = { ...defaultProps, ...propsIn };
	const searchParams = useSearchParams();

	const [editMode, setEditMode] = useState<boolean>(props.edit || (searchParams.get('edit') === 'true' ? true : false));
	const [date, setDate] = useState<Date | null>();

	const {
		getValues,
		setValue,
		register,
		formState: { errors },
	} = useForm<TaskForm>();

	const promptUpdateTask = () => {
		const formValues = getValues();
		const noChanges =
			task[0]!.name === formValues.name &&
			task[0]!.description === formValues.description &&
			getDate(task[0]!.complete).valueOf() === (date?.valueOf() ?? formValues.complete.valueOf());
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
						{task[0]!.name !== formValues.name && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Name</Text>
								<Text>Old value: {task[0]?.name ?? ''}</Text>
								<Text>New value: {formValues.name}</Text>
							</Stack>
						)}
						{task[0]!.description !== formValues.description && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Description</Text>
								<Text>Old value: {task[0]?.description ?? ''}</Text>
								<Text>New value: {formValues.description}</Text>
							</Stack>
						)}
						{getDate(task[0]!.complete).valueOf() !== (date?.valueOf() ?? formValues.complete.valueOf()) && (
							<Stack spacing='xs'>
								<Text c='dimmed'>Complete date</Text>
								<Text>
									Old value: {task[0] ? getDate(task[0].complete).toLocaleString() : new Date().toLocaleString()}
								</Text>
								<Text>New value: {date ? date.toLocaleString() : formValues.complete.toLocaleString()}</Text>
							</Stack>
						)}
					</Stack>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'green', disabled: noChanges },
			onConfirm: () => {
				if (!task[0]) {
					toast('Task is null', { type: 'error' });
				} else {
					date && setValue('complete', date);
					const result = updateTask(task[0], getValues());
					if (result.success) {
						toast('Successfully updated task', { type: 'success' });
						router.push('/tasks');
					} else {
						toast('Unable to update task', { type: 'error' });
					}
				}
			},
		});
	};

	const promptDeleteTask = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Deleting task',
			children: (
				<Container>
					<Alert icon={<FaExclamation />} title='Are you sure you want to delete?' color='red' radius='xs' mb={rem(4)}>
						This action cannot be undone
					</Alert>
				</Container>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			confirmProps: { color: 'red', disabled: !task[0] },
			onConfirm: () => {
				if (!task[0]) {
					toast('Task is null', { type: 'error' });
				} else {
					const result = deleteTask(task[0]);
					if (result.success) {
						toast(`Successfully deleted this task`, { type: 'success' });
					} else {
						toast('Unable to delete task', { type: 'error' });
					}
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
			confirmProps: { color: 'green', disabled: !task[0] },
			onConfirm: () => {
				if (!task[0]) {
					toast('Task is null', { type: 'error' });
				} else {
					setValue('name', task[0].name);
					setValue('description', task[0].description);
					const resetDate = getDate(task[0].complete);
					setValue('complete', resetDate);
					setDate(resetDate);
					setEditMode(false);
				}
			},
		});
	};

	useEffect(() => {
		if (!task[0]) {
			return () => {};
		}
		setValue('name', task[0].name);
		setValue('description', task[0].description);
		setValue('complete', getDate(task[0].complete));
	}, [setValue, task]);

	return (
		<>
			<Container size='md' px='xs' pt='lg'>
				<Card shadow='sm' padding='sm' radius='md' withBorder className='relative'>
					<LoadingOverlay
						visible={!task[0] && task[1]}
						overlayBlur={2}
						transitionDuration={500}
						loaderProps={{ size: 'md', color: 'orange', variant: 'oval' }}
					/>
					{!task[0] && task[3] && !task[3].exists() ? (
						<TaskLoadError />
					) : (
						<div>
							{!editMode && <Text className='absolute right-2'>id: {task[0] ? task[0].id : '123-abc'}</Text>}
							<Card.Section ml={rem(4)} pt={rem(4)}>
								<Flex direction='column' gap='xs'>
									{editMode ? (
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
									) : (
										<Flex direction='column'>
											<Text size='sm'>Task name</Text>
											<Text size='xl'>{task[0]?.name ?? 'Task name'}</Text>
										</Flex>
									)}
									{editMode ? (
										<TextInput
											placeholder='Task description'
											label='Description'
											radius='md'
											size='md'
											error={errors.description?.message}
											{...register('description')}
										/>
									) : (
										<Flex direction='column'>
											<Text size='sm'>Description</Text>
											<Text size='xl'>{task[0]?.description ?? 'Task description'}</Text>
										</Flex>
									)}
								</Flex>
							</Card.Section>
							<Card.Section ml={rem(4)} pt={rem(4)}>
								{editMode && task[0] ? (
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
										defaultValue={getDate(task[0].complete)}
									/>
								) : (
									<Flex direction='column'>
										<Text size='sm'>Complete on</Text>
										<Group>
											{!task[0] ? (
												<Text size='md'>1/1/1970 12:00 AM EDT</Text>
											) : (
												<Text size='md'>{convertToTimestamp(task[0].complete)}</Text>
											)}
											{!days || !task[0] ? (
												<Text color='green'>{`(1 year overdue)`}</Text>
											) : (
												<Text color={getColor(days)}>{`(${days.message})`}</Text>
											)}
										</Group>
									</Flex>
								)}
							</Card.Section>
							{!editMode && (
								<>
									<Divider my='md' />
									<Card.Section ml={rem(4)} pt={rem(4)}>
										<Group grow spacing='xs'>
											<Flex direction='column'>
												<Text size='xs'>Task created</Text>
												{!task[0] ? (
													<Text size='md'>1/1/1970 12:00 AM EDT</Text>
												) : (
													<Text size='sm'>{convertToTimestamp(task[0].created)}</Text>
												)}
											</Flex>
											<Flex direction='column'>
												<Text size='xs'>Last updated</Text>
												{!task[0] ? (
													<Text size='md'>1/1/1970 12:00 AM EDT</Text>
												) : (
													<Text size='sm'>{convertToTimestamp(task[0].updated)}</Text>
												)}
											</Flex>
										</Group>
									</Card.Section>
								</>
							)}
							<Divider my='sm' />
							<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
								<Group spacing='sm'>
									{editMode && (
										<Button color='green' onClick={promptUpdateTask}>
											Confirm changes
										</Button>
									)}
									{editMode && (
										<Button color='yellow' onClick={promptCancelChanges}>
											Discard changes
										</Button>
									)}
									{!editMode && (
										<Button color='orange' onClick={() => setEditMode(true)}>
											Update task
										</Button>
									)}
									<Button color='red' onClick={promptDeleteTask}>
										Delete task
									</Button>
								</Group>
							</Card.Section>
						</div>
					)}
				</Card>
			</Container>
		</>
	);
}

export default TaskIDPage;
