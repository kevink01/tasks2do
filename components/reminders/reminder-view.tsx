import { ReminderFetch } from '@/types/reminder';
import { convertToDay, convertToTimestamp, daysRemaining, getColor } from '@/util/time';
import { Button, Card, Divider, Flex, Group, rem, Text } from '@mantine/core';
import React from 'react';

type ReminderViewProps = {
	reminder: ReminderFetch;

	promptDeleteReminder: () => void;
	toggleEditMode: (mode?: boolean) => void;
};

export default function ReminderView({ reminder, promptDeleteReminder, toggleEditMode }: ReminderViewProps) {
	const days = daysRemaining(reminder.dueDate);
	return (
		<div>
			<Text className='absolute right-2'>id: {reminder.id}</Text>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column' gap='xs'>
					<Flex direction='column'>
						<Text size='sm'>Reminder name</Text>
						<Text size='xl'>{reminder.name}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>Description</Text>
						<Text size='xl'>{reminder.description}</Text>
					</Flex>
				</Flex>
			</Card.Section>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='sm'>Due date</Text>
						<Group>
							<Text size='md'>{convertToDay(reminder.dueDate, reminder.allDay)}</Text>
							{!reminder.isCompleted && <Text color={getColor(days)}>{`(${days.message})`}</Text>}
						</Group>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>All Day</Text>
						<Text>{reminder.allDay ? 'Yes' : 'No'}</Text>
					</Flex>
				</Group>
			</Card.Section>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='sm'>Is completed</Text>
						<Text size='md'>{reminder.isCompleted ? 'Yes' : 'No'}</Text>
					</Flex>
					{reminder.isCompleted && (
						<Flex direction='column'>
							<Text size='sm'>Completed Date</Text>
							{reminder.completedAt && <Text size='md'>{convertToTimestamp(reminder.completedAt)}</Text>}
						</Flex>
					)}
				</Group>
			</Card.Section>
			<Divider my='md' />
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='xs'>Reminder created</Text>
						<Text size='sm'>{convertToTimestamp(reminder.createdAt)}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='xs'>Last updated</Text>
						<Text size='sm'>{convertToTimestamp(reminder.updatedAt)}</Text>
					</Flex>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='orange' onClick={() => toggleEditMode(true)}>
						Update reminder
					</Button>
					<Button color='red' onClick={promptDeleteReminder}>
						Delete reminder
					</Button>
				</Group>
			</Card.Section>
		</div>
	);
}
