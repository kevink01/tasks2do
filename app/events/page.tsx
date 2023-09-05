'use client';

import React, { useState } from 'react';
import { useProtectedRoute } from '@/hooks/auth';
import { useEvents } from '@/hooks/use-events';
import { Accordion, ActionIcon, Box, Button, Container, Grid, rem, Tooltip, Transition } from '@mantine/core';
import CustomLink from '@/components/custom-link';
import { FaCalendar, FaTable } from 'react-icons/fa';
import { GridLoader } from '@/components/loaders/grid-loader';
import NoEvents from '@/components/events/no-events';
import { fadeTransition } from '@/util/transition';
import EventCalendar from '@/components/events/event-calendar';
import EventCard from '@/components/events/event-card';
import { useSettings } from '@/hooks/use-settings';

export default function Events() {
	useProtectedRoute();
	const { events } = useEvents();
	const { settings } = useSettings();

	const [calendarMode, setCalendarMode] = useState<boolean>(false);
	const [transition, setTransition] = useState<boolean>(false);

	const toggleCalendarMode = () => {
		setTransition(true);
		setTimeout(() => {
			setCalendarMode((mode) => !mode);
			setTransition(false);
		}, 200);
	};

	return (
		<Container size='lg' px='xs'>
			<Accordion defaultValue='events' pb={rem(10)}>
				<Accordion.Item value='events'>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: rem(10) }}>
						<Accordion.Control>Events</Accordion.Control>
						<CustomLink href='/events/create'>
							<Button color='orange'>Create event</Button>
						</CustomLink>
						<Tooltip
							label={calendarMode ? 'Table mode' : 'Calendar mode'}
							color='orange'
							position='bottom'
							withArrow
							arrowPosition='center'
							events={{ hover: true, focus: true, touch: false }}>
							<ActionIcon
								color='orange'
								size='xl'
								radius='xl'
								variant='light'
								onClick={toggleCalendarMode}
								disabled={events?.length === 0}>
								{calendarMode ? <FaTable /> : <FaCalendar />}
							</ActionIcon>
						</Tooltip>
					</Box>
					<Accordion.Panel>Description</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
			{!settings ? (
				<GridLoader />
			) : !events ? (
				<GridLoader />
			) : events.length === 0 ? (
				<NoEvents />
			) : (
				<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
					{(styles) => (
						<div style={styles}>
							{calendarMode ? (
								<EventCalendar events={events} />
							) : (
								<Grid gutter={5}>
									{events.map((event) => {
										return <EventCard key={event.id} event={event} settings={settings} />;
									})}
								</Grid>
							)}
						</div>
					)}
				</Transition>
			)}
		</Container>
	);

	// const test: EventForm = {
	// 	name: 'hello',
	// 	description: 'hi',
	// 	time: {
	// 		start: new Date(),
	// 		end: new Date('2024-01-01'),
	// 	},
	// 	allDay: true,
	// 	label: {
	// 		name: 'Kevin',
	// 		color: '#fffee333',
	// 	},
	// 	location: 'Hello',
	// 	notification: {
	// 		duration: 30,
	// 		unit: 'days',
	// 	},
	// };
	//
	// const testFunction = () => {
	// 	const result = parse<EventForm>(eventFormSchema, test);
	// 	console.log(result);
	// };

	// return <button onClick={testFunction}>Click me!</button>;
}
