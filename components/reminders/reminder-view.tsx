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
	const days = daysRemaining(reminder.complete);
	return (
		<div>
			<Text className='absolute right-2'>id: {reminder.id}</Text>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column' gap='xs'>
					<Flex direction='column'>
						<Text size='sm'>Task name</Text>
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
						<Text size='sm'>Complete on</Text>
						<Group>
							<Text size='md'>{convertToDay(reminder.complete, reminder.allDay)}</Text>
							<Text color={getColor(days)}>{`(${days.message})`}</Text>
						</Group>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>All Day</Text>
						<Text>{reminder.allDay ? 'true' : 'false'}</Text>
					</Flex>
				</Group>
			</Card.Section>
			<Divider my='md' />
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='xs'>Task created</Text>
						<Text size='sm'>{convertToTimestamp(reminder.created)}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='xs'>Last updated</Text>
						<Text size='sm'>{convertToTimestamp(reminder.updated)}</Text>
					</Flex>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='orange' onClick={() => toggleEditMode(true)}>
						Update task
					</Button>
					<Button color='red' onClick={promptDeleteReminder}>
						Delete task
					</Button>
				</Group>
			</Card.Section>
		</div>
	);
}