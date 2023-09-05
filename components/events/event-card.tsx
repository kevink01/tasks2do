'use client';

import { useEvents } from '@/hooks/use-events';
import { EventFetch } from '@/types/event';
import { Settings } from '@/types/settings';
import { notify, updateNotification } from '@/util/notifications/notify';
import { convertToDay, convertToTimestamp, daysRemaining } from '@/util/time';
import { Alert, Box, Button, Card, Container, Divider, Grid, Group, rem, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import CustomLink from '../custom-link';

type EventCardProps = {
	event: EventFetch;
	settings: Settings;
};

export default function EventCard({ event, settings }: EventCardProps) {
	const { deleteEvent } = useEvents();

	const promptDeleteEvent = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Deleting event',
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
					`delete-event-${event.id}`,
					`Deleting event: ${event.name}`,
					'Your data will be loaded',
					true,
					settings,
					'info'
				);
				const result = deleteEvent(event);
				if (result.success) {
					updateNotification(id, 'Success', 'Successfully deleted this event', settings, 'success', <FaTrash />);
				} else {
					updateNotification(id, 'Error', 'Unable to delete event', settings, 'error');
				}
			},
		});
	};

	const date = daysRemaining(event.time.start);

	return (
		<Grid.Col span={4} key={event.id}>
			<Card shadow='sm' padding='sm' radius='md' withBorder className='hover:cursor-pointer'>
				<Card.Section mx={rem(4)}>
					<Group align='top'>
						<Stack spacing={0} align='top'>
							<CustomLink href={`/reminders/${event.id}`}>
								<Text size='xl' td='underline'>
									{event.name}
								</Text>
								<Text></Text>
							</CustomLink>
							<Text fs='italic' lineClamp={1}>
								{event.description.length === 0 ? '(No description)' : event.description}
							</Text>
						</Stack>
					</Group>
					<Divider />
					<Text size='md'>
						<Text fs='italic'>Start time:</Text>
						<Group>
							<Text>{convertToDay(event.time.start, event.allDay)}</Text>
							{event.allDay && <Text color='blue'>(All day)</Text>}
						</Group>
					</Text>
					<Text size='md'>
						<Text fs='italic'>End time:</Text>
						<Group>
							<Text>{convertToDay(event.time.end, event.allDay)}</Text>
							{event.allDay && <Text color='blue'>(All day)</Text>}
						</Group>
					</Text>
				</Card.Section>
				<Card.Section mx={rem(4)} mt={rem(4)} mb={rem(4)}>
					<Box sx={{ display: 'flex', gap: rem(4) }}>
						<CustomLink href={`/events/${event.id}?edit=true`}>
							<Button color='orange' leftIcon={<FaPen />}>
								Update event
							</Button>
						</CustomLink>

						<Button color='red' leftIcon={<FaTrash />} onClick={promptDeleteEvent}>
							Delete event
						</Button>
					</Box>
				</Card.Section>
				<Card.Section mx={rem(4)} pb={rem(4)}>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Created on:</Text>
						<Text>{convertToTimestamp(event.createdAt)}</Text>
					</Text>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Last updated:</Text>
						<Text>{convertToTimestamp(event.updatedAt)}</Text>
					</Text>
				</Card.Section>
			</Card>
		</Grid.Col>
	);
}
