import { Checkbox, Divider, Group, rem, Stack, Text, Title } from '@mantine/core';

import { useTasks } from '@/hooks/use-tasks';
import { Settings } from '@/types/settings';
import { TaskFetch } from '@/types/task';
import { notify } from '@/util/notifications/notify';
import { convertToTimestamp, getDate, getTime } from '@/util/time';
import CustomLink from '../custom-link';

type TaskInfoProps = {
	task: TaskFetch;
	settings: Settings;
};
function TaskInfo({ task, settings }: TaskInfoProps) {
	const { markComplete } = useTasks();

	const markTaskAsComplete = (checked: boolean) => {
		const result = markComplete(task, checked);
		if (!result.success) {
			notify(`check-task-${task.id}-${Date.now()}`, 'Error!', 'Unable to complete task', false, settings, 'error');
		} else {
			task.isCompleted = result.data.isCompleted;
			task.completedDate = result.data.completedDate
				? { seconds: result.data.completedDate.getTime() / 1000, nanoseconds: 0 }
				: null;
		}
	};

	return (
		<Group>
			<Checkbox
				color='orange'
				radius='xl'
				size='lg'
				defaultChecked={task.isCompleted}
				mt={rem(10)}
				onChange={(e) => markTaskAsComplete(e.currentTarget.checked)}
			/>
			<Divider size='xl' orientation='vertical' color='red' />
			<div className='flex-1'>
				<Stack spacing='xs'>
					<Group>
						<div className='flex-1'>
							<CustomLink href={`/tasks/${task.id}`}>
								<Title order={4} td='underline'>
									{task.name}
								</Title>
							</CustomLink>
						</div>
						<Text>{getTime(getDate(task.dueDate))}</Text>
					</Group>
					<Group>
						<div className='flex-1'>
							<Text>{task.description}</Text>
						</div>
						{task.isCompleted && (
							<Group spacing={rem(10)}>
								<Text fs='italic'>Completed on: </Text>
								<Text>{task.completedDate && convertToTimestamp(task.completedDate)}</Text>
							</Group>
						)}
					</Group>
				</Stack>
			</div>
		</Group>
	);
}

export default TaskInfo;
