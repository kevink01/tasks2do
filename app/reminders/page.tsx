'use client';

import { FaTable, FaCalendar } from 'react-icons/fa';
import { Accordion, ActionIcon, Box, Button, Container, Tooltip, rem } from '@mantine/core';
import CustomLink from '@/components/custom-link';
import { useState } from 'react';

function Reminders() {
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
			<Accordion defaultValue='tasks' pb={rem(10)}>
				<Accordion.Item value='tasks'>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: rem(10) }}>
						<Accordion.Control>Tasks</Accordion.Control>
						<CustomLink href='/tasks/create'>
							<Button color='orange'>Create task</Button>
						</CustomLink>
						<Tooltip
							label={calendarMode ? 'Table mode' : 'Calendar mode'}
							color='orange'
							position='bottom'
							withArrow
							arrowPosition='center'
							events={{ hover: true, focus: true, touch: false }}>
							<ActionIcon color='orange' size='xl' radius='xl' variant='light' onClick={toggleCalendarMode}>
								{calendarMode ? <FaTable /> : <FaCalendar />}
							</ActionIcon>
						</Tooltip>
					</Box>
					<Accordion.Panel>Description</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</Container>
	);
}

export default Reminders;
