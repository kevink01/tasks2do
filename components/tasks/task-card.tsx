import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { Alert, Box, Button, Card, Container, Divider, Grid, rem, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import { useTasks } from '@/hooks/use-tasks';
import { useSettings } from '@/hooks/use-settings';
import { TaskFetch } from '@/types/task';
import { notify, updateNotification } from '@/util/notifications/notify';
import { convertToTimestamp, daysRemaining, getColor } from '@/util/time';
import CustomLink from '../custom-link';

type TaskCardProps = {
	task: TaskFetch;
};

function TaskCard({ task }: TaskCardProps) {
	const { deleteTask } = useTasks();
	const { settings } = useSettings();

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
				const id = notify(
					`delete-task-${task.id}`,
					`Deleting task: ${task.name}`,
					'Your data will be loaded',
					true,
					settings,
					'info'
				);
				const result = deleteTask(task);
				if (result.success) {
					updateNotification(id, 'Success', 'Successfully deleted this task', settings, 'success', <FaTrash />);
				} else {
					updateNotification(id, 'Error', 'Unable to delete task', settings, 'error');
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
						<Text>{convertToTimestamp(task.complete)}</Text>
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
						<Text>{convertToTimestamp(task.created)}</Text>
					</Text>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Last updated:</Text>
						<Text>{convertToTimestamp(task.updated)}</Text>
					</Text>
				</Card.Section>
			</Card>
		</Grid.Col>
	);
}

export default TaskCard;
