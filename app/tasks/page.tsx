'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, Alert, Box, Button, Card, Container, Grid, Modal, Text, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import { useProtectedRoute } from '@/hooks/auth';
import { useTasks } from '@/hooks/types';
import { Task } from '@/types/tasks';

function Tasks() {
	useProtectedRoute();
	const router = useRouter();

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	const [opened, { open, close }] = useDisclosure();
	const { tasks, createTask, updateTask, deleteTask } = useTasks();

	const promptDeleteTask = (task: Task) => {
		open();
		setSelectedTask(task);
	};

	const deleteSelectedTask = () => {
		deleteTask(selectedTask as Task);
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
			<Container size='md' px='xs'>
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
					<Container>
						<Grid gutter={5}>
							{tasks.map((task) => {
								return (
									<Grid.Col span={4} key={task.id}>
										<Card shadow='sm' padding='sm' radius='md' withBorder>
											<Card.Section ml={rem(4)}>
												<Text size='xl'>{task.name}</Text>
												<Text fs='italic' lineClamp={1}>
													{task.description}
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
													{/* {new Date(
														task.timestamp.seconds * 1000 + task.timestamp.nanoseconds / 1000000 // Converts to milliseconds
													).toLocaleDateString()} */}
												</Text>
											</Card.Section>
										</Card>
									</Grid.Col>
								);
							})}
						</Grid>
					</Container>
				)}
			</Container>
		</>
	);
}

export default Tasks;
