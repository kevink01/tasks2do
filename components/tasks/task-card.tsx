import { Alert, Box, Button, Card, Checkbox, Container, Divider, Grid, Group, rem, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';

import { useTasks } from '@/hooks/use-tasks';
import { Settings } from '@/types/settings';
import { TaskFetch } from '@/types/task';
import { notify, updateNotification } from '@/util/notifications/notify';
import { convertToTimestamp, daysDifference, daysRemaining, getColor } from '@/util/time';
import CustomLink from '../custom-link';

type TaskCardProps = {
	task: TaskFetch;
	settings: Settings;
};

function TaskCard({ task, settings }: TaskCardProps) {
	const { markComplete, deleteTask } = useTasks();

	const markTaskAsComplete = (checked: boolean) => {
		const result = markComplete(task, checked);
		if (!result.success) {
			notify(`check-task-${task.id}-${Date.now()}`, 'Error!', 'Unable to complete task', false, settings, 'error');
		}
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

	const date =
		task.isCompleted && task.completedAt ? daysDifference(task.dueDate, task.completedAt) : daysRemaining(task.dueDate);
	return (
		<Grid.Col span={4} key={task.id}>
			<Card shadow='sm' padding='sm' radius='md' withBorder className='hover:cursor-pointer'>
				<Card.Section mx={rem(4)}>
					<Group align='top'>
						<Checkbox
							color='orange'
							radius='xl'
							size='lg'
							defaultChecked={task.isCompleted}
							mt={rem(10)}
							onChange={(e) => markTaskAsComplete(e.currentTarget.checked)}
						/>
						<Stack spacing={0} align='top'>
							<CustomLink href={`/tasks/${task.id}`}>
								<Text size='xl' td='underline'>
									{task.name}
								</Text>
							</CustomLink>
							<Text fs='italic' lineClamp={1}>
								{task.description}
							</Text>
						</Stack>
					</Group>
					<Divider />
					<Text size='md'>
						<Text fs='italic'>Complete on:</Text>
						<Text>{convertToTimestamp(task.dueDate)}</Text>
						{task.isCompleted ? (
							<>
								<Text fs='italic'>Completed on:</Text>
								<Text>{task.completedAt && convertToTimestamp(task.completedAt)}</Text>
							</>
						) : (
							<Text color={getColor(date)}>{`(${date.message})`}</Text>
						)}
					</Text>
				</Card.Section>
				<Card.Section ml={rem(4)} mt={rem(4)} mb={rem(4)}>
					<Box sx={{ display: 'flex', gap: rem(4) }}>
						<CustomLink href={`/tasks/${task.id}?edit=true`}>
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
						<Text>{convertToTimestamp(task.createdAt)}</Text>
					</Text>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Last updated:</Text>
						<Text>{convertToTimestamp(task.updatedAt)}</Text>
					</Text>
				</Card.Section>
			</Card>
		</Grid.Col>
	);
}

export default TaskCard;
