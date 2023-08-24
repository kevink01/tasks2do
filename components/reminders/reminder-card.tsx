'use client';

import useReminders from '@/hooks/use-reminders';
import { useSettings } from '@/hooks/use-settings';
import { ReminderFetch } from '@/types/reminder';
import { convertToDay, convertToTimestamp, daysRemaining, getColor } from '@/util/time';
import { Alert, Box, Button, Card, Checkbox, Container, Divider, Grid, Group, rem, Stack, Text } from '@mantine/core';
import React from 'react';
import CustomLink from '../custom-link';
import { FaExclamation, FaPen, FaTrash } from 'react-icons/fa';
import { modals } from '@mantine/modals';
import { notify, updateNotification } from '@/util/notifications/notify';

type ReminderCardProps = {
	reminder: ReminderFetch;
};

export default function ReminderCard({ reminder }: ReminderCardProps) {
	const { markComplete, deleteReminder } = useReminders();

	const markReminderAsComplete = (checked: boolean) => {
		const result = markComplete(reminder, checked);
		if (!result.success) {
			notify(
				`check-task-${reminder.id}-${Date.now()}`,
				'Error!',
				'Unable to complete reminder',
				false,
				settings,
				'error'
			);
		}
	};

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

	const date = daysRemaining(reminder.dueDate);

	return (
		<Grid.Col span={4} key={reminder.id}>
			<Card shadow='sm' padding='sm' radius='md' withBorder className='hover:cursor-pointer'>
				<Card.Section mx={rem(4)}>
					<Group align='top'>
						<Checkbox
							color='orange'
							radius='xl'
							size='lg'
							defaultChecked={reminder.isCompleted}
							mt={rem(10)}
							onChange={(e) => markReminderAsComplete(e.currentTarget.checked)}
						/>
						<Stack spacing={0} align='top'>
							<CustomLink href={`/reminders/${reminder.id}`}>
								<Text size='xl' td='underline'>
									{reminder.name}
								</Text>
								<Text></Text>
							</CustomLink>
							<Text fs='italic' lineClamp={1}>
								{reminder.description.length === 0 ? '(No description)' : reminder.description}
							</Text>
						</Stack>
					</Group>
					<Divider />
					<Text size='md'>
						<Text fs='italic'>Complete on:</Text>
						<Group>
							{reminder.allDay ? (
								<>
									<Text>{convertToDay(reminder.dueDate, reminder.allDay)}</Text>
									<Text color='blue'>(All day)</Text>
								</>
							) : (
								<Text>{convertToDay(reminder.dueDate, reminder.allDay)}</Text>
							)}
						</Group>
						{reminder.isCompleted ? (
							<>
								<Text fs='italic'>Completed on:</Text>
								<Text>{reminder.completedAt && convertToTimestamp(reminder.completedAt)}</Text>
							</>
						) : (
							<Text color={getColor(date)}>{`(${date.message})`}</Text>
						)}
					</Text>
				</Card.Section>
				<Card.Section mx={rem(4)} mt={rem(4)} mb={rem(4)}>
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
				<Card.Section mx={rem(4)} pb={rem(4)}>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Created on:</Text>
						<Text>{convertToTimestamp(reminder.createdAt)}</Text>
					</Text>
					<Text fz='sm' display='flex' sx={{ gap: rem(4) }}>
						<Text fs='italic'>Last updated:</Text>
						<Text>{convertToTimestamp(reminder.updatedAt)}</Text>
					</Text>
				</Card.Section>
			</Card>
		</Grid.Col>
	);
}
