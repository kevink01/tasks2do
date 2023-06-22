'use client';

import { Accordion, Container } from '@mantine/core';
import Tasks from '@/components/dashboard/tasks';

function Dashboard() {
	return (
		<Container>
			<Accordion variant='filled' radius='xs' defaultValue='tasks'>
				<Tasks />
			</Accordion>
		</Container>
	);
}

export default Dashboard;
