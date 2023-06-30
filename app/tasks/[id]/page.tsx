'use client';

import { useRouter } from 'next/navigation';
import {
	Alert,
	Button,
	Card,
	Center,
	Container,
	Divider,
	Flex,
	Group,
	LoadingOverlay,
	Modal,
	Stack,
	Text,
	Title,
	rem,
} from '@mantine/core';
import { doc, getFirestore } from 'firebase/firestore';
import { useUserDocument } from '@/hooks/firestore';
import { TaskFetch } from '@/types/tasks';
import { convertToTimestamp, daysRemaining, getColor, getDate } from '@/util/time';
import TaskLoadError from './error';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { FaExclamation } from 'react-icons/fa';
import { toast } from 'react-toastify';

function TaskIDPage({ params }: { params: { id: string } }) {
	const router = useRouter();

	const task = useUserDocument<TaskFetch>((user) => doc(getFirestore(), `/users/${user.uid}/tasks/${params.id}`));
	const days = task[0] ? daysRemaining(task[0].complete) : null;

	const [selectedTask, setSelectedTask] = useState<TaskFetch | null>(null);
	const [opened, { open, close }] = useDisclosure();
	const { deleteTask } = useTasks();

	const promptDeleteTask = (task: TaskFetch) => {
		open();
		setSelectedTask(task);
	};

	const deleteSelectedTask = () => {
		const firebaseResult = deleteTask(selectedTask as TaskFetch);
		if (firebaseResult.success) {
			toast(`Successfully deleted this task`, { type: 'success' });
		} else {
			toast('Unable to delete task', { type: 'error' });
		}
		closeModal();
		router.push('/tasks');
	};

	const closeModal = () => {
		setSelectedTask(null);
		close();
	};

	return (
		<>
			<Modal
				centered
				title={selectedTask ? `Deleting task: ${selectedTask.name}` : `Deleting task`}
				opened={opened}
				onClose={close}>
				<Alert icon={<FaExclamation />} title='Are you sure you want to delete?' color='red' radius='xs' mb={rem(4)}>
					This action cannot be undone
				</Alert>

				<Center>
					<Button color='red' onClick={deleteSelectedTask}>
						Delete task
					</Button>
				</Center>
			</Modal>
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
							<Text className='absolute right-2'>id: {task[0] ? task[0].id : '123-abc'}</Text>
							<Card.Section ml={rem(4)} pt={rem(4)}>
								<Flex direction='column' gap='xs'>
									<Flex direction='column'>
										<Text size='sm'>Task name</Text>
										<Text size='xl'>{task[0]?.name ?? 'Task name'}</Text>
									</Flex>
									<Flex direction='column'>
										<Text size='sm'>Description</Text>
										<Text size='xl'>{task[0]?.description ?? 'Task description'}</Text>
									</Flex>
								</Flex>
							</Card.Section>
							<Card.Section ml={rem(4)} pt={rem(4)}>
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
							</Card.Section>
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
							<Divider my='sm' />
							<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
								<Group spacing='sm'>
									<Button color='orange'>Update task</Button>
									<Button color='red' onClick={() => task[0] && promptDeleteTask(task[0])}>
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

	// return <div>{params.id}</div>;
}

export default TaskIDPage;
