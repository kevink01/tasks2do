'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, Alert, Box, Button, Card, Container, Divider, Grid, Modal, Text, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import { useProtectedRoute } from '@/hooks/auth';
import { useTasks } from '@/hooks/use-tasks';
import { TaskFetch } from '@/types/tasks';
import { convertToTimestamp, daysRemaining, getColor } from '@/util/time';
import { toast } from 'react-toastify';
import CustomLink from '@/components/custom-link';
import { TasksGridLoader } from './loading';
import NoTasks from '@/components/tasks/no-tasks';

function Tasks() {
	useProtectedRoute();
	const router = useRouter();

	const [selectedTask, setSelectedTask] = useState<TaskFetch | null>(null);

	const [opened, { open, close }] = useDisclosure();
	const { tasks, deleteTask } = useTasks();

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
	};

	const closeModal = () => {
		setSelectedTask(null);
		close();
	};

	return (
		<>
			<Modal centered opened={opened} onClose={close}>
				<Alert icon={<FaExclamation />} title='Are you sure you want to delete?' color='red' radius='xs' mb={rem(4)}>
					This action cannot be undone
				</Alert>
				<Button color='red' onClick={deleteSelectedTask}>
					Delete task
				</Button>
			</Modal>
			<Container size='lg' px='xs'>
				<Accordion defaultValue='tasks' pb={rem(10)}>
					<Accordion.Item value='tasks'>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: rem(10) }}>
							<Accordion.Control>Tasks</Accordion.Control>
							<CustomLink href='/tasks/create'>
								<Button color='orange'>Create task</Button>
							</CustomLink>
						</Box>
						<Accordion.Panel>Description</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
				{!tasks ? (
					<TasksGridLoader />
				) : tasks.length === 0 ? (
					<NoTasks />
				) : (
					<Grid gutter={5}>
						{tasks.map((task) => {
							const date = daysRemaining(task.complete);
							return (
								<Grid.Col span={4} key={task.id}>
									<Card
										shadow='sm'
										padding='sm'
										radius='md'
										withBorder
										onClick={() => router.push(`/tasks/${task.id}`)}
										className='hover:cursor-pointer'>
										<Card.Section ml={rem(4)}>
											<Text size='xl'>{task.name}</Text>
											<Text fs='italic' lineClamp={1}>
												{task.description}
											</Text>
											<Divider />
											<Text size='md'>
												<Text fs='italic'>Complete on:</Text>
												{convertToTimestamp(task.complete)}
												<Text color={getColor(date)}>{`(${date.message})`}</Text>
											</Text>
										</Card.Section>
										<Card.Section ml={rem(4)} mt={rem(4)} mb={rem(4)}>
											<Box sx={{ display: 'flex', gap: rem(4) }}>
												<CustomLink href={`/tasks/${task.id}`}>
													<Button color='orange' leftIcon={<FaPen />}>
														Update task
													</Button>
												</CustomLink>
												<Button color='red' leftIcon={<FaTrash />} onClick={() => promptDeleteTask(task)}>
													Delete task
												</Button>
											</Box>
										</Card.Section>
										<Card.Section ml={rem(4)} pb={rem(4)}>
											<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
												<Text fs='italic'>Created on:</Text>
												{convertToTimestamp(task.created)}
											</Text>
											<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
												<Text fs='italic'>Last updated:</Text>
												{convertToTimestamp(task.updated)}
											</Text>
										</Card.Section>
									</Card>
								</Grid.Col>
							);
						})}
					</Grid>
				)}
			</Container>
		</>
	);
}

export default Tasks;
