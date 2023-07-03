import { Divider, Group, Stack, Text, Title } from '@mantine/core';
import { TaskFetch } from '@/types/tasks';
import { getDate, getTime } from '@/util/time';
import CustomLink from '../custom-link';

type Props = {
	task: TaskFetch;
};
function TaskInfo({ task }: Props) {
	return (
		<Group>
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
						<Text>{getTime(getDate(task.complete))}</Text>
					</Group>
					<Text>{task.description}</Text>
				</Stack>
			</div>
		</Group>
	);
}

export default TaskInfo;
