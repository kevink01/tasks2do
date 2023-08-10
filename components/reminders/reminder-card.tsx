'use client';

import useReminders from '@/hooks/use-reminders';
import { useSettings } from '@/hooks/use-settings';
import { ReminderFetch } from '@/types/reminder';
import { convertToDay, convertToTimestamp, daysRemaining, getColor } from '@/util/time';
import { Alert, Box, Button, Card, Container, Divider, Grid, Group, rem, Text } from '@mantine/core';
import React from 'react';
import CustomLink from '../custom-link';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import { modals } from '@mantine/modals';
import { notify, updateNotification } from '@/util/notifications/notify';

type ReminderCardProps = {
	reminder: ReminderFetch;
};

export default function ReminderCard({ reminder }: ReminderCardProps) {
	const { deleteReminder } = useReminders();
	const { settings } = useSettings();

	const promptDeleteReminder = () => {
		modals.openConfirmModal({
			centered: true,
			title: 'Deleting reminder',
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
					`delete-reminder-${reminder.id}`,
					`Deleting reminder: ${reminder.name}`,
					'Your data will be loaded',
					true,
					settings,
					'info'
				);
				const result = deleteReminder(reminder);
				if (result.success) {
					updateNotification(id, 'Success', 'Successfully deleted this reminder', settings, 'success', <FaTrash />);
				} else {
					updateNotification(id, 'Error', 'Unable to delete reminder', settings, 'error');
				}
			},
		});
	};

	const date = daysRemaining(reminder.complete);

	return (
		<Grid.Col span={4} key={reminder.id}>
			<Card shadow='sm' padding='sm' radius='md' withBorder className='hover:cursor-pointer'>
				<Card.Section ml={rem(4)}>
					<CustomLink href={`/reminders/${reminder.id}`}>
						<Text size='xl' td='underline'>
							{reminder.name}
						</Text>
					</CustomLink>
					<Text fs='italic' lineClamp={1}>
						{reminder.description}
					</Text>
					<Divider />
					<Text size='md'>
						<Text fs='italic'>Complete on:</Text>
						<Group>
							{reminder.allDay ? (
								<>
									<Text>{convertToDay(reminder.complete, reminder.allDay)}</Text>
									<Text color='blue'>(All day)</Text>
								</>
							) : (
								<Text>{convertToDay(reminder.complete, reminder.allDay)}</Text>
							)}
						</Group>
						<Text color={getColor(date)}>{`(${date.message})`}</Text>
					</Text>
				</Card.Section>
				<Card.Section ml={rem(4)} mt={rem(4)} mb={rem(4)}>
					<Box sx={{ display: 'flex', gap: rem(4) }}>
						<CustomLink href={`/reminders/${reminder.id}?edit=true`}>
							<Button color='orange' leftIcon={<FaPen />}>
								Update reminder
							</Button>
						</CustomLink>

						<Button color='red' leftIcon={<FaTrash />} onClick={promptDeleteReminder}>
							Delete reminder
						</Button>
					</Box>
				</Card.Section>
				<Card.Section ml={rem(4)} pb={rem(4)}>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Created on:</Text>
						<Text>{convertToTimestamp(reminder.created)}</Text>
					</Text>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Last updated:</Text>
						<Text>{convertToTimestamp(reminder.updated)}</Text>
					</Text>
				</Card.Section>
			</Card>
		</Grid.Col>
	);
}
