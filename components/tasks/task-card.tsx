import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { Alert, Box, Button, Card, Container, Divider, Grid, rem, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import { TaskFetch } from '@/types/tasks';
import { convertToTimestamp, daysRemaining, getColor } from '@/util/time';
import { useTasks } from '@/hooks/use-tasks';
import CustomLink from '../custom-link';
import { toast } from 'react-toastify';

type TaskCardProps = {
	task: TaskFetch;
	router: AppRouterInstance;
};

function TaskCard({ task }: TaskCardProps) {
	const { deleteTask } = useTasks();

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
			confirmProps: { color: 'red' },
			onConfirm: () => {
				const result = deleteTask(task);
				if (result.success) {
					toast(`Successfully deleted this task`, { type: 'success' });
				} else {
					toast('Unable to delete task', { type: 'error' });
				}
			},
		});
	};

	const date = daysRemaining(task.complete);
	return (
		<Grid.Col span={4} key={task.id}>
			<Card shadow='sm' padding='sm' radius='md' withBorder className='hover:cursor-pointer'>
				<Card.Section ml={rem(4)}>
					<CustomLink href={`/tasks/${task.id}`}>
						<Text size='xl' td='underline'>
							{task.name}
						</Text>
					</CustomLink>
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

						<Button color='red' leftIcon={<FaTrash />} onClick={promptDeleteTask}>
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
}

export default TaskCard;
