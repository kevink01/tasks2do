'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, Alert, Box, Button, Card, Container, Divider, Grid, Modal, Text, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import { useProtectedRoute } from '@/hooks/auth';
import { useTasks } from '@/hooks/types';
import { TaskFetch } from '@/types/tasks';
import { convertToTimestamp, daysRemaining } from '@/util/time';

function Tasks() {
	useProtectedRoute();
	const router = useRouter();

	const [selectedTask, setSelectedTask] = useState<TaskFetch | null>(null);

	const [opened, { open, close }] = useDisclosure();
	const { tasks, createTask, updateTask, deleteTask } = useTasks();

	const promptDeleteTask = (task: TaskFetch) => {
		open();
		setSelectedTask(task);
	};

	const deleteSelectedTask = () => {
		deleteTask(selectedTask as TaskFetch);
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
							<Button onClick={() => router.push('/tasks/create')}>Create Task</Button>
						</Box>
						<Accordion.Panel>Description</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
				{tasks?.length && (
					<Grid gutter={5}>
						{tasks.map((task) => {
							const date = daysRemaining(task.complete);
							return (
								<Grid.Col span={4} key={task.id}>
									<Card shadow='sm' padding='sm' radius='md' withBorder>
										<Card.Section ml={rem(4)}>
											<Text size='xl'>{task.name}</Text>
											<Text fs='italic' lineClamp={1}>
												{task.description}
											</Text>
											<Divider />
											<Text size='md'>
												<Text fs='italic'>Complete on:</Text>
												{convertToTimestamp(task.complete)}
												<Text
													color={`${
														date.severity === 'error'
															? 'red'
															: date.severity === 'danger'
															? 'orange'
															: date.severity === 'warn'
															? 'yellow'
															: 'green'
													}`}>{`(${date.message})`}</Text>
											</Text>
										</Card.Section>
										<Card.Section ml={rem(4)} mt={rem(4)} mb={rem(4)}>
											<Box sx={{ display: 'flex', gap: rem(4) }}>
												<Button color='orange' leftIcon={<FaPen />}>
													Update task
												</Button>
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
