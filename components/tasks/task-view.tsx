import { Button, Card, Divider, Flex, Group, Space, Text, rem } from '@mantine/core';
import { TaskFetch } from '@/types/task';
import { convertToTimestamp, daysRemaining, getColor } from '@/util/time';

type TaskViewProps = {
	task: TaskFetch;

	promptDeleteTask: () => void;
	toggleEditMode: (mode?: boolean) => void;
};

export default function TaskView({ task, promptDeleteTask, toggleEditMode }: TaskViewProps) {
	const days = daysRemaining(task.dueDate);
	return (
		<div>
			<Text className='absolute right-2'>id: {task.id}</Text>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column' gap='xs'>
					<Flex direction='column'>
						<Text size='sm'>Task name</Text>
						<Text size='xl'>{task.name}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>Description</Text>
						<Text size='xl'>{task.description}</Text>
					</Flex>
				</Flex>
			</Card.Section>
			<Space h={rem(4)} />
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column'>
					<Text size='sm'>Due date</Text>
					<Group>
						<Text size='md'>{convertToTimestamp(task.dueDate)}</Text>
						{!task.isCompleted && <Text color={getColor(days)} size='md'>{`(${days.message})`}</Text>}
					</Group>
				</Flex>
			</Card.Section>
			<Space h={rem(4)} />
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='sm'>Is completed</Text>
						<Text size='md'>{task.isCompleted ? 'Yes' : 'No'}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>Completed Date</Text>
						{task.completedAt && <Text size='md'>{convertToTimestamp(task.completedAt)}</Text>}
					</Flex>
				</Group>
			</Card.Section>
			<Divider my='md' />
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='xs'>Task created</Text>
						<Text size='sm'>{convertToTimestamp(task.createdAt)}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='xs'>Last updated</Text>
						<Text size='sm'>{convertToTimestamp(task.updatedAt)}</Text>
					</Flex>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='orange' onClick={() => toggleEditMode(true)}>
						Update task
					</Button>
					<Button color='red' onClick={promptDeleteTask}>
						Delete task
					</Button>
				</Group>
			</Card.Section>
		</div>
	);
}
