import { EventFetch } from '@/types/event';
import { convertToDay, convertToTimestamp, daysRemaining, getColor } from '@/util/time';
import { Button, Card, Divider, Flex, Group, Text, rem } from '@mantine/core';

type EventViewProps = {
	event: EventFetch;

	promptDeleteEvent: () => void;
	toggleEditMode: (mode?: boolean) => void;
};

export default function EventView({ event, promptDeleteEvent, toggleEditMode }: EventViewProps) {
	const days = daysRemaining(event.time.start);
	return (
		<div>
			<Text className='absolute right-2'>id: {event.id}</Text>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column' gap='xs'>
					<Flex direction='column'>
						<Text size='sm'>Event name</Text>
						<Text size='xl'>{event.name}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>Description</Text>
						<Text size='xl'>{event.description}</Text>
					</Flex>
				</Flex>
			</Card.Section>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='sm'>Start time</Text>
						<Group>
							<Text size='md'>{convertToDay(event.time.start, event.allDay)}</Text>
						</Group>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>End time</Text>
						<Group>
							<Text size='md'>{convertToDay(event.time.end, event.allDay)}</Text>
						</Group>
					</Flex>
					<Flex direction='column'>
						<Text size='sm'>All Day</Text>
						<Text>{event.allDay ? 'Yes' : 'No'}</Text>
					</Flex>
				</Group>
			</Card.Section>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column'>
					<Text size='sm'>Location</Text>
					<Text size='md'>{event.location ?? 'No location'}</Text>
				</Flex>
			</Card.Section>
			<Divider my='md' />
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Text size='sm'>Label</Text>
				<Group spacing={rem(4)}>
					<div className='rounded-full w-4 h-4 bg-red-500' style={{ backgroundColor: event.label.color }}></div>
					<Text size='md'>{event.label.name}</Text>
				</Group>
			</Card.Section>
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Flex direction='column'>
					<Text>Notification</Text>
					<Text>
						{event.notification.duration === 0
							? 'No notification'
							: `${event.notification.duration} ${event.notification.unit}`}
					</Text>
				</Flex>
			</Card.Section>
			<Divider my='md' />
			<Card.Section ml={rem(4)} pt={rem(4)}>
				<Group grow spacing='xs'>
					<Flex direction='column'>
						<Text size='xs'>Event created</Text>
						<Text size='sm'>{convertToTimestamp(event.createdAt)}</Text>
					</Flex>
					<Flex direction='column'>
						<Text size='xs'>Last updated</Text>
						<Text size='sm'>{convertToTimestamp(event.updatedAt)}</Text>
					</Flex>
				</Group>
			</Card.Section>
			<Divider my='sm' />
			<Card.Section ml={rem(4)} pt={rem(4)} pb={rem(10)}>
				<Group spacing='sm'>
					<Button color='orange' onClick={() => toggleEditMode(true)}>
						Update event
					</Button>
					<Button color='red' onClick={promptDeleteEvent}>
						Delete event
					</Button>
				</Group>
			</Card.Section>
		</div>
	);
}
