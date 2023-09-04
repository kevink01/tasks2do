'use client';

import { EventFetch } from '@/types/event';
import { getBeginningOfDay } from '@/util/time';
import { scaleTransition } from '@/util/transition';
import { Accordion, Button, Center, Container, Group, Indicator, Space, Stack, Text, Transition } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import { useState } from 'react';
import CustomLink from '../custom-link';
import EventInfo from './event-info';

type EventCalendarProps = {
	events: EventFetch[];
};

type DateEvents = {
	date: Date | null;
	events: EventFetch[];
};

function filterEvents(reminders: EventFetch[], date: Date): EventFetch[] {
	return reminders
		.filter((reminder) => getBeginningOfDay(reminder.time.start).valueOf() === date.valueOf())
		.sort((reminder1, reminder2) => {
			const reminder1Time = reminder1.time.start.seconds + reminder1.time.start.nanoseconds / 1000000;
			const reminder2Time = reminder2.time.start.seconds + reminder2.time.start.nanoseconds / 1000000;
			return reminder1Time - reminder2Time || reminder1.name > reminder2.name
				? 1
				: reminder1.name < reminder2.name
				? -1
				: 0;
		});
}

export default function EventCalendar({ events }: EventCalendarProps) {
	const today = dayjs(Date.now());

	const [dateEvents, setDateEvents] = useState<DateEvents>({
		date: null,
		events: filterEvents(events, today.toDate()),
	});

	const days = events.map((reminder) => {
		return getBeginningOfDay(reminder.time.start).valueOf();
	});

	const [open, setOpen] = useState<boolean>(true);

	const opacity = scaleTransition('X');

	const handleSelectDate = (date: Date) => {
		if (dateEvents.date && dateEvents.date.valueOf() === date.valueOf()) {
			setOpen((mode) => !mode);
			setTimeout(() => {
				setDateEvents({ events: [], date: null });
			}, 200);
		} else {
			if (events) {
				const filteredReminders = filterEvents(events, date);
				if (dateEvents.date !== null) {
					setDateEvents({ ...dateEvents, date: null });
					setOpen(false);
					setTimeout(() => {
						setDateEvents({ date: date, events: filteredReminders });
					}, 200);
				} else {
					setDateEvents({ date: date, events: filteredReminders });
				}
			} else {
				setDateEvents({ date: date, events: [] });
			}
			setOpen(true);
		}
	};

	return (
		<Container>
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
							<Indicator color='purple'>
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
							if (Math.floor(dayjs(dateEvents.date).diff(date, 'd', true)) === 0) {
								return (
									<Indicator color={days.includes(date.valueOf()) ? 'purple' : 'blue'} offset={-2}>
										<div>{date.getDate()}</div>
									</Indicator>
								);
							}
							if (Math.floor(today.diff(date, 'd', true)) === 0) {
								return (
									<Indicator color={days.includes(date.valueOf()) ? 'purple' : 'green'} offset={-2}>
										<div>{date.getDate()}</div>
									</Indicator>
								);
							}
							return (
								<Indicator color='purple' offset={-2} disabled={!days.includes(date.valueOf())}>
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
								setDateEvents({ date: null, events: [] });
							}
						}}
					/>
				</Center>
				<Accordion value={open && dateEvents.date ? 'tasks' : 'none'} transitionDuration={200}>
					<Accordion.Item value='tasks'>
						<Accordion.Control disabled={!dateEvents.date} onClick={() => setOpen((state) => !state)}>
							<Group>
								<Text>Tasks for date:</Text>
								<Transition mounted={open} transition={opacity} duration={200} timingFunction='ease'>
									{(styles) => (
										<Text style={styles}>{dateEvents.date ? ` ${dateEvents.date.toLocaleDateString()}` : ''}</Text>
									)}
								</Transition>
							</Group>
						</Accordion.Control>
						<Accordion.Panel>
							{dateEvents.events.length === 0 ? (
								<Stack spacing='xs'>
									<Text align='center'>No tasks for this day</Text>
									<Text align='center'>How about we create some events?</Text>
									<Center>
										<CustomLink href='/reminders/create'>
											<Button color='orange' mx='auto'>
												Create event
											</Button>
										</CustomLink>
									</Center>
								</Stack>
							) : (
								<Stack spacing='xs' align='left'>
									{dateEvents.events.map((event) => {
										return <EventInfo event={event} key={event.id} />;
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
