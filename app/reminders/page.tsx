'use client';

import { useState } from 'react';
import { Accordion, ActionIcon, Box, Button, Container, Grid, Tooltip, Transition, rem } from '@mantine/core';
import { FaTable, FaCalendar } from 'react-icons/fa';

import CustomLink from '@/components/custom-link';
import { GridLoader } from '@/components/loaders/grid-loader';
import NoReminders from '@/components/reminders/no-reminders';
import ReminderCalendar from '@/components/reminders/reminder-calendar';
import ReminderCard from '@/components/reminders/reminder-card';
import { useProtectedRoute } from '@/hooks/auth';
import useReminders from '@/hooks/use-reminders';
import { getBeginningOfDay } from '@/util/time';
import { fadeTransition } from '@/util/transition';

function Reminders() {
	useProtectedRoute();
	const { reminders } = useReminders();

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
			<Accordion defaultValue='reminders' pb={rem(10)}>
				<Accordion.Item value='reminders'>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: rem(10) }}>
						<Accordion.Control>Reminders</Accordion.Control>
						<CustomLink href='/reminders/create'>
							<Button color='orange'>Create reminder</Button>
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
								disabled={reminders?.length === 0}>
								{calendarMode ? <FaTable /> : <FaCalendar />}
							</ActionIcon>
						</Tooltip>
					</Box>
					<Accordion.Panel>Description</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
			{!reminders ? (
				<GridLoader />
			) : reminders.length === 0 ? (
				<NoReminders />
			) : (
				<Transition mounted={!transition} transition={fadeTransition()} duration={200} timingFunction='ease'>
					{(styles) => (
						<div style={styles}>
							{calendarMode ? (
								<ReminderCalendar reminders={reminders} />
							) : (
								<Grid gutter={5}>
									{reminders.map((reminder) => {
										return <ReminderCard key={reminder.id} reminder={reminder} />;
									})}
								</Grid>
							)}
						</div>
					)}
				</Transition>
			)}
		</Container>
	);
}

export default Reminders;
