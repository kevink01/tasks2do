import { useState } from 'react';
import { Accordion, Button, Center, Container, Group, Indicator, Space, Stack, Text, Transition } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';

import { ReminderFetch } from '@/types/reminder';
import { getBeginningOfDay } from '@/util/time';
import { scaleTransition } from '@/util/transition';
import CustomLink from '../custom-link';
import ReminderInfo from './reminder-info';

type DateReminders = {
	date: Date | null;
	reminders: ReminderFetch[];
};

type ReminderCalenderProps = {
	reminders: ReminderFetch[];
};

function filterReminders(reminders: ReminderFetch[], date: Date): ReminderFetch[] {
	return reminders
		.filter((reminder) => getBeginningOfDay(reminder.complete).valueOf() === date.valueOf())
		.sort((reminder1, reminder2) => {
			const reminder1Time = reminder1.complete.seconds + reminder1.complete.nanoseconds / 1000000;
			const reminder2Time = reminder2.complete.seconds + reminder2.complete.nanoseconds / 1000000;
			return reminder1Time - reminder2Time || reminder1.name > reminder2.name
				? 1
				: reminder1.name < reminder2.name
				? -1
				: 0;
		});
}

export default function ReminderCalendar({ reminders }: ReminderCalenderProps) {
	const today = dayjs(Date.now());
	const [dateReminders, setDateReminders] = useState<DateReminders>({
		date: null,
		reminders: filterReminders(reminders, today.toDate()),
	});
	const days = reminders.map((reminder) => {
		return getBeginningOfDay(reminder.complete).valueOf();
	});

	const [open, setOpen] = useState<boolean>(true);

	const opacity = scaleTransition('X');

	const handleSelectDate = (date: Date) => {
		if (dateReminders.date && dateReminders.date.valueOf() === date.valueOf()) {
			setOpen((mode) => !mode);
			setTimeout(() => {
				setDateReminders({ reminders: [], date: null });
			}, 200);
		} else {
			if (reminders) {
				const filteredReminders = filterReminders(reminders, date);
				if (dateReminders.date !== null) {
					setDateReminders({ ...dateReminders, date: null });
					setOpen(false);
					setTimeout(() => {
						setDateReminders({ date: date, reminders: filteredReminders });
					}, 200);
				} else {
					setDateReminders({ date: date, reminders: filteredReminders });
				}
			} else {
				setDateReminders({ date: date, reminders: [] });
			}
			setOpen(true);
		}
	};

	return (
		<Container size='sm' px='xs'>
			<Stack>
				<Space h='xs' />
				<Center>
					<Group spacing='md'>
						<Group spacing='xs'>
							<Indicator color='green'>
								<></>
							</Indicator>
							<Text>Today</Text>
						</Group>
						<Group spacing='xs'>
							<Indicator color='blue'>
								<></>
							</Indicator>
							<Text>Selected date</Text>
						</Group>
						<Group spacing='xs'>
							<Indicator color='yellow'>
								<></>
							</Indicator>
							<Text>Task</Text>
						</Group>
					</Group>
				</Center>
				<Center>
					<Calendar
						size='md'
						firstDayOfWeek={0}
						renderDay={(date) => {
							if (Math.floor(dayjs(dateReminders.date).diff(date, 'd', true)) === 0) {
								return (
									<Indicator color={days.includes(date.valueOf()) ? 'yellow' : 'blue'} offset={-2}>
										<div>{date.getDate()}</div>
									</Indicator>
								);
							}
							if (Math.floor(today.diff(date, 'd', true)) === 0) {
								return (
									<Indicator color={days.includes(date.valueOf()) ? 'yellow' : 'green'} offset={-2}>
										<div>{date.getDate()}</div>
									</Indicator>
								);
							}
							return (
								<Indicator color='yellow' offset={-2} disabled={!days.includes(date.valueOf())}>
									<div>{date.getDate()}</div>
								</Indicator>
							);
						}}
						getDayProps={(date) => ({
							onClick: () => handleSelectDate(date),
						})}
						onLevelChange={(level) => {
							if (open && level !== 'month') {
								setOpen(false);
								setDateReminders({ date: null, reminders: [] });
							}
						}}
					/>
				</Center>
				<Accordion value={open && dateReminders.date ? 'tasks' : 'none'} transitionDuration={200}>
					<Accordion.Item value='tasks'>
						<Accordion.Control disabled={!dateReminders.date} onClick={() => setOpen((state) => !state)}>
							<Group>
								<Text>Tasks for date:</Text>
								<Transition mounted={open} transition={opacity} duration={200} timingFunction='ease'>
									{(styles) => (
										<Text style={styles}>
											{dateReminders.date ? ` ${dateReminders.date.toLocaleDateString()}` : ''}
										</Text>
									)}
								</Transition>
							</Group>
						</Accordion.Control>
						<Accordion.Panel>
							{dateReminders.reminders.length === 0 ? (
								<Stack spacing='xs'>
									<Text align='center'>No tasks for this day</Text>
									<Text align='center'>How about we create some tasks?</Text>
									<Center>
										<CustomLink href='/reminders/create'>
											<Button color='orange' mx='auto'>
												Create reminder
											</Button>
										</CustomLink>
									</Center>
								</Stack>
							) : (
								<Stack spacing='xs' align='left'>
									{dateReminders.reminders.map((reminder) => {
										return <ReminderInfo reminder={reminder} key={reminder.id} />;
									})}
								</Stack>
							)}
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Stack>
		</Container>
	);
}
